/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./components/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}"
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				"charcoal-blue": "#171F2A",
				"slate-gray": "#4B5A6F"
			},
			fontFamily: {
				poppins: [
					"Poppins_400Regular",
					"Poppins_500Medium",
					"Poppins_600SemiBold"
				]
			}
		}
	},
	plugins: []
};
