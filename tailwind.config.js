/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./components/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
		"./features/**/*.{js,jsx,ts,tsx}",
		"./hooks/**/*.{js,jsx,ts,tsx}"
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				"charcoal-blue": "#171F2A",
				"charcoal-slate": "#364458",
				"slate-gray": "#4B5A6F",
				"slate-gray-blue": "#3D4D61",
				"light-gray": "#D9D9D9",
				"light-steel-gray": "#A3A1A1",
				"darker-gray": "#2F2F2F"
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
