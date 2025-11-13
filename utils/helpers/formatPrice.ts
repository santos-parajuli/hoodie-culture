export function formatPrice(amount: number, currency: 'USD' | 'CAD' = 'CAD'): string {
	return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-CA', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}
