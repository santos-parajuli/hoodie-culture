'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItemInterface, customProductId } from '@/utils/types/types';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

/* eslint-disable @typescript-eslint/no-explicit-any */
type HoodiePartsProps = {
	nodes: any[];
	onNodeClick: (node: any) => void;
	onResetCamera: () => void;
	getScreenshot: () => string;
	controls: any;
};
const defaultPalette = ['#ffffff', '#000000', '#808080', '#1A2D5C', '#F5F5DC', '#556B2F', '#800020'];
const partGroups: Record<string, string[]> = {
	'Fabric [Front and Back]': ['front', 'back'],
	Elastics: ['elastic_down', 'elastic_left', 'elastic_right'],
	'Draw String': ['drawstring_left_long', 'drawstring_left_short', 'drawstring_right_long', 'drawstring_right_short'],
	'Draw String Hooks': ['drawstring_left_short_hook', 'drawstring_left_long_hook', 'drawstring_right_long_hook', 'drawstring_right_short_hook'],
	Cap: ['cap_left', 'cap_right', 'pocket_lining_inside_left_high', 'pocket_lining_inside_right_high', 'pocket_lining_inside_left_low', 'pocket_lining_inside_right_low'],
	Pocket: ['pocket', 'pocket_lining_left', 'pocket_lining_right'],
	'Left Sleeve': ['sleeve_left'],
	'Right Sleeve': ['sleeve_right'],
};
// Wizard steps
const steps = [
	{
		id: 'global',
		title: 'Global Color',
		description: 'Pick a base color for the entire hoodie',
		parts: ['all'],
		isGlobal: true,
	},
	{
		id: 'front-pocket',
		title: 'Front & Pocket',
		description: 'Customize front and pocket colors',
		parts: ['Fabric [Front and Back]', 'Pocket', 'Elastics'],
	},
	{
		id: 'sleeves',
		title: 'Sleeves',
		description: 'Customize left and right sleeves',
		parts: ['Left Sleeve', 'Right Sleeve'],
	},
	{
		id: 'drawstring-cap',
		title: 'Drawstring & Cap',
		description: 'Customize drawstrings and cap',
		parts: ['Draw String', 'Draw String Hooks', 'Cap'],
	},
];

export default function HoodieCustomizer({ nodes, onNodeClick, onResetCamera, controls, getScreenshot }: HoodiePartsProps) {
	const [step, setStep] = useState(0);
	const [colors, setColors] = useState<{ [key: string]: string }>({});
	const [globalCustomColors, setGlobalCustomColors] = useState<string[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const addItem = useAppStore((state) => state.addItem);
	// Calculate progress
	const progress = ((step + 1) / steps.length) * 100;
	// Handle color change
	const handleColorChange = (partName: string, color: string, isGlobal = false) => {
		const targetParts = isGlobal ? Object.keys(partGroups) : [partName];
		targetParts.forEach((p) => {
			const nodeNames = partGroups[p];
			nodeNames.forEach((name) => {
				const node = nodes.find((n) => n.name === name);
				if (node && node.material) {
					if (!node.material.isMaterialCloned) {
						node.material = node.material.clone();
						node.material.isMaterialCloned = true;
					}
					if (Array.isArray(node.material)) {
						node.material.forEach((m: any) => m.color.set(color));
					} else {
						node.material.color.set(color);
					}
					node.material.needsUpdate = true;
				}
			});
		});
		// Store selected colors
		const updatedColors = { ...colors };
		targetParts.forEach((p) => (updatedColors[p] = color));
		setColors(updatedColors);
		// Add to custom palette if needed
		if (!defaultPalette.includes(color)) {
			setGlobalCustomColors([color]);
		}
		// Focus first node
		const firstNodeName = partGroups[targetParts[0]][0];
		const firstNode = nodes.find((n) => n.name === firstNodeName);
		if (firstNode) onNodeClick(firstNode);
		onResetCamera();
	};
	// Navigation
	const handleNextStep = () => {
		if (step < steps.length - 1) setStep(step + 1);
		else setIsComplete(true);
	};
	const handlePrevStep = () => {
		if (step > 0) setStep(step - 1);
	};
	const variants = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -50 },
	};
	const addToCart = () => {
		setIsAdding(true); // start loading
		onResetCamera();
		setTimeout(() => {
			const itemToAdd: CartItemInterface = {
				productId: customProductId,
				name: `Custom Hoodie`,
				price: 50,
				qty: 1,
				image: getScreenshot(), // capture after camera reset
				customization: { colors },
			};
			addItem(itemToAdd);
			console.log('added to cart:', itemToAdd);
			setIsAdding(false); // stop loading
		}, 2500);
	};

	return (
		<div className='w-full min-h-max max-w-md overflow-clip mx-auto p-6 rounded-lg bg-card/30'>
			{!isComplete ? (
				<>
					{/* Progress */}
					<div className='mb-8'>
						<div className='flex justify-between mb-2'>
							<span className='text-sm font-medium'>
								Step {step + 1} of {steps.length}
							</span>
							<span className='text-sm font-medium'>{Math.round(progress)}%</span>
						</div>
						<Progress value={progress} className='h-2' />
					</div>
					{/* Step indicators */}
					<div className='flex justify-between mb-8'>
						{steps.map((s, i) => (
							<div key={s.id} className='flex flex-col items-center'>
								<div
									className={cn(
										'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
										i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' : 'bg-secondary text-secondary-foreground'
									)}>
									{i < step ? <CheckCircle2 className='h-4 w-4' /> : i + 1}
								</div>
								<span className='text-xs mt-1 hidden sm:block'>{s.title}</span>
							</div>
						))}
					</div>
					{/* Step content */}
					<AnimatePresence mode='wait'>
						<motion.div key={step} initial='hidden' animate='visible' exit='exit' variants={variants} transition={{ duration: 0.3 }}>
							<div className='mb-6'>
								<h2 className='text-xl font-bold'>{steps[step].title}</h2>
								<p className='text-sm text-muted-foreground'>{steps[step].description}</p>
							</div>
							<div className='space-y-6'>
								{steps[step].parts.map((partName) => {
									const palette = [...defaultPalette, ...globalCustomColors];
									return (
										<div key={partName}>
											<h4 className='font-semibold mb-2'>{partName}</h4>
											<div className='flex flex-wrap gap-2'>
												{palette.map((color) => (
													<div
														key={color}
														className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform ${colors[partName] === color ? 'border-black scale-110' : 'border-gray-200'}`}
														style={{ backgroundColor: color }}
														onClick={() => handleColorChange(partName, color, steps[step].isGlobal)}
													/>
												))}
												<input type='color' className='w-8 h-8 p-0 border-none cursor-pointer' value={colors[partName] || '#ffffff'} onChange={(e) => handleColorChange(partName, e.target.value, steps[step].isGlobal)} />
											</div>
										</div>
									);
								})}
							</div>
							{/* Navigation */}
							<div className='flex justify-between pt-6'>
								<Button type='button' variant='outline' onClick={handlePrevStep} disabled={step === 0} className={cn(step === 0 && 'invisible')}>
									<ArrowLeft className='mr-2 h-4 w-4' /> Back
								</Button>
								<Button type='button' onClick={handleNextStep}>
									{step === steps.length - 1 ? 'Finish' : 'Next'}
									{step < steps.length - 1 && <ArrowRight className='ml-2 h-4 w-4' />}
								</Button>
							</div>
						</motion.div>
					</AnimatePresence>
				</>
			) : (
				<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className='text-center py-10'>
					{(controls.current.autoRotate = true)}
					<div className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4'>
						<CheckCircle2 className='h-8 w-8 text-primary' />
					</div>
					<h2 className='text-2xl font-bold mb-2'>Customization Complete!</h2>
					<p className='text-muted-foreground mb-6'>Your hoodie colors have been saved.</p>
					<div className='flex gap-2 justify-center'>
						<Button
							onClick={() => {
								setStep(0);
								setColors({});
								setGlobalCustomColors([]);
								setIsComplete(false);
							}}>
							Start Over
						</Button>
						{/* Disable until capture is ready */}
						<Button onClick={addToCart} disabled={isAdding}>
							{isAdding ? 'Adding to cart…' : 'Add To Cart'}
						</Button>
					</div>
				</motion.div>
			)}
		</div>
	);
}
