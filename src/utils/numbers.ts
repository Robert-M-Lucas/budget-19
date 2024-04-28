import {round} from "lodash";

export function roundFix(amount: number): string {
    if (Number.isNaN(amount)) {
        return "?";
    }
    return round(amount, 2).toFixed(2);
}

export function nanDisplay(amount: number): string {
    if (Number.isNaN(amount) || !Number.isFinite(amount)) {
        return "?";
    }
    return amount.toString();
}