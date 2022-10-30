import styled from "styled-components";
import { AppLogoSpin } from "./Keyframes";

const StyledApp = styled.main`
	position: relative;
	width: 100vw;
	height: 100vh;
	text-align: center;
`;

export const StyledAppHeader = styled.header`
	background-color: #282c34;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: calc(10px + 2vmin);
	color: white;
`;

export const StyledAppLink = styled.a`
	color: #61dafb;
`;

export const StyledAppLogo = styled.img`
	height: 40vmin;
	pointer-events: none;

	@media (prefers-reduced-motion: no-preference) {
		animation: ${AppLogoSpin} infinite 20s linear;
	}
`;

export const StyledAppMenu = styled.nav`
	position: fixed;
	top: 0;
	left: 0;
	background-color: #1d2026;
	height: 8vh;
	width: 100%;
	pointer-events: none;

	> img {
		position: relative;
		left: -3vw;
		vertical-align: middle;
		height: 100%;
	}

	> span {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		color: #fff;
		left: -3vw;
	}
`;

export const StyledAppList = styled.ul`
	position: relative;
	top: 8vh;
	display: flex;
	flex-direction: column;
	font-size: calc(10px + 2vmin);
	color: white;
	min-height: 100vh;
	background-color: #282c34;
`;

export const StyledAppItem = styled.li`
	display: grid;
	grid-template-columns: 1fr max-content auto;
	column-gap: 1vmax;
	align-items: center;
	padding: 1vmax;

	> img {
		max-width: 10vmax;
		max-height: 20vmax;
	}

	> label {
		text-align: left;
	}
`;

export default StyledApp;
