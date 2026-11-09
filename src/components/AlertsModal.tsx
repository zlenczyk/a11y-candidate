import { useEffect, useRef } from "react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";

import { copy } from "../data/fixtures";

export interface AlertsModalProps {
	onClose: () => void;
}

const closeButtonClass = css({
	alignSelf: "flex-start",
	bg: "surface.base",
	borderColor: "border.primary",
	borderRadius: "md",
	borderStyle: "solid",
	borderWidth: "xs",
	color: "text.primary",
	cursor: "pointer",
	h: "10",
	px: "4",
	textStyle: "t_small_b",
	_hover: { bg: "surface.subtle" },
	_focusVisible: {
		outlineColor: "focus.default",
		outlineOffset: "0.125rem",
		outlineStyle: "solid",
		outlineWidth: "0.125rem",
	},
});

const checkboxClass = css({
	accentColor: "graphics.brand",
	h: "5",
	w: "5",
	_focusVisible: {
		outlineColor: "focus.default",
		outlineOffset: "0.125rem",
		outlineStyle: "solid",
		outlineWidth: "0.125rem",
	},
});

const labelClass = css({
	alignItems: "center",
	color: "text.primary",
	cursor: "pointer",
	display: "flex",
	gap: "3",
	textStyle: "t_medium",
});

const dialogClass = css({
	bg: "surface.elevated",
	borderColor: "border.secondary",
	borderRadius: "lg",
	borderStyle: "solid",
	borderWidth: "xs",
	color: "text.primary",
	m: "auto",
	maxW: "24rem",
	p: "6",
	w: "calc(100% - 2rem)",
	_backdrop: { bg: "surface.scrim" },
});

export function AlertsModal({ onClose }: AlertsModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const heatChangesRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		const opener = document.activeElement;
		if (!dialog) return;

		dialog.showModal();
		heatChangesRef.current?.focus();

		return () => {
			dialog.close();
			if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="alert-preferences-title"
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			className={dialogClass}
		>
			<Stack gap="4">
				<h2
					id="alert-preferences-title"
					className={css({ color: "text.primary", textStyle: "h_small" })}
				>
					{copy.alertTitle}
				</h2>
				<Stack gap="3">
					<label className={labelClass}>
						<input
							ref={heatChangesRef}
							type="checkbox"
							className={checkboxClass}
						/>
						{copy.heatChanges}
					</label>
					<label className={labelClass}>
						<input type="checkbox" className={checkboxClass} />
						{copy.medalCeremonies}
					</label>
				</Stack>
				<button type="button" className={closeButtonClass} onClick={onClose}>
					{copy.close}
				</button>
			</Stack>
		</dialog>
	);
}

AlertsModal.displayName = "AlertsModal";
