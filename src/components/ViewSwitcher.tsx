import { css } from "styled-system/css";

import { type ViewId, type ViewOption, views } from "../data/fixtures";

export interface ViewSwitcherProps {
	activeView: ViewId;
	onViewChange: (view: ViewId) => void;
}

const tabClass = css({
	alignItems: "center",
	borderBottomColor: "transparent",
	borderBottomStyle: "solid",
	borderBottomWidth: "sm",
	color: "text.primary",
	cursor: "pointer",
	display: "inline-flex",
	px: "4",
	py: "2",
	textDecoration: "none",
	textStyle: "t_small_b",
	_hover: { color: "text.link_hover" },
	"&[aria-pressed=true]": {
		borderBottomColor: "border.selected",
		color: "text.selected",
	},
	_focusVisible: {
		outlineColor: "focus.default",
		outlineOffset: "0.125rem",
		outlineStyle: "solid",
		outlineWidth: "0.125rem",
	},
});

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
	return (
		<fieldset
			aria-label="Views"
			className={css({
				borderBottomColor: "border.secondary",
				borderBottomStyle: "solid",
				borderBottomWidth: "xs",
				display: "flex",
				flexDirection: { base: "column", md: "row" },
				gap: "2",
			})}
		>
			{views.map((view: ViewOption) => (
				<button
					key={view.id}
					type="button"
					aria-pressed={view.id === activeView}
					className={tabClass}
					onClick={() => onViewChange(view.id)}
				>
					{view.label}
				</button>
			))}
		</fieldset>
	);
}

ViewSwitcher.displayName = "ViewSwitcher";
