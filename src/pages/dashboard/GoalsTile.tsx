import {ReactNode} from "react";
import {UserPrefs} from "../../utils/user_prefs.ts";

export default function goalsTile(userPrefs: UserPrefs): ReactNode {

    return <p>Goal: {userPrefs.getNeedsBudget()} | {userPrefs.getWantsBudget()} | {userPrefs.getSavingsBudget()}</p>;
}