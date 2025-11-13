/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Box3, Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import React, { Suspense, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import HoodieCustomizer from './hoodie-parts';

// Smooth Camera Controller
function CameraController({ target, controls }: { target: Vector3 | null; controls: any }) {
	const { camera } = useThree();
	const lerpFactor = 0.03;
	const currentLookAt = useRef(new Vector3());
	useFrame(() => {
		if (target && controls.current) {
			const desiredPosition = target.clone().add(new Vector3(0, 1, 3));
			camera.position.lerp(desiredPosition, lerpFactor);
			currentLookAt.current.lerp(target, lerpFactor);
			controls.current.target.copy(currentLookAt.current);
			controls.current.update();
		}
	});
	return null;
}
// 3D Model Component
function Model({ setNodesList }: { onNodeClick: (node: any) => void; setNodesList: (nodes: any[]) => void }) {
	const { scene } = useGLTF('/Hoodie.glb');
	useEffect(() => {
		const nodes: any[] = [];
		scene.traverse((child: any) => {
			if (child.isMesh) nodes.push(child);
		});
		setNodesList(nodes);
	}, [scene, setNodesList]);
	return <primitive object={scene} />;
}

// ✅ Helper to expose gl via ref
// eslint-disable-next-line react/display-name
const ScreenshotHelper = forwardRef((_props, ref) => {
	const { gl } = useThree();
	useImperativeHandle(ref, () => ({
		getScreenshot: () => gl.domElement.toDataURL('image/png'),
	}));

	return null; // renders nothing
});

export default function HoodieViewer() {
	const [focusTarget, setFocusTarget] = useState<Vector3 | null>(null);
	const [nodesList, setNodesList] = useState<any[]>([]);
	const canvasRef = useRef<HTMLDivElement>(null);
	const controls = useRef<any>(null);
	const screenshotRef = useRef<{ getScreenshot: () => string }>(null);
	const callCount = useRef(0);

	const moveCameraToTarget = (target: Vector3) => {
		callCount.current += 1;
		console.log(`hi (#${callCount.current}) target=`, target.toArray());
		setFocusTarget(target);
		setTimeout(() => {
			setFocusTarget(null);
			if (controls.current) {
				controls.current.reset();
				controls.current.autoRotate = false;
			}
		}, 2000);
	};

	const handleNodeClick = (node: any) => {
		const box = new Box3().setFromObject(node);
		const center = new Vector3();
		box.getCenter(center);
		console.log('handleNodeClick triggered for node:', node.name || node.uuid);
	};

	// ✅ This is now safe to call from HoodieCustomizer
	const getScreenshot = () => {
		if (screenshotRef.current) {
			return screenshotRef.current.getScreenshot();
		}
		return '';
	};

	useEffect(() => {
		if (controls.current) controls.current.saveState();
	}, []);

	return (
		<div className='flex w-full justify-between flex-col lg:flex-row h-full'>
			{/* Sidebar */}
			<div className='w-full min-h-fit lg:w-md lg:min-w-md p-4 overflow-y-auto'>
				<HoodieCustomizer
					controls={controls}
					nodes={nodesList}
					onNodeClick={handleNodeClick}
					getScreenshot={getScreenshot} // ✅ works now
					onResetCamera={() => moveCameraToTarget(new Vector3(0, 0, 0))}
				/>
			</div>
			{/* 3D Canvas */}
			<div ref={canvasRef} className='w-full mx-auto md:min-w-lg h-[90vh]'>
				<Canvas camera={{ position: [0, 2, 5], fov: 50 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
					{/* Expose gl to parent */}
					<ScreenshotHelper ref={screenshotRef} />
					<ambientLight intensity={0.3} />
					<directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
					<pointLight position={[-5, 5, -5]} intensity={0.5} />
					<Suspense fallback={null}>
						<Center>
							<Model onNodeClick={handleNodeClick} setNodesList={setNodesList} />
						</Center>
						<Environment background={false} preset='city' />
					</Suspense>
					<OrbitControls target={[0, 0, 0]} ref={controls} autoRotate enableDamping dampingFactor={0.01} enableZoom={false} autoRotateSpeed={-1.5} />
					<CameraController target={focusTarget} controls={controls} />
				</Canvas>
			</div>
		</div>
	);
}
