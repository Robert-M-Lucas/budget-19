import {ReactNode, useState} from "react";
import {setUserPrefs, UserPrefs} from "../../../utils/user_prefs.ts";
import MultiRangeSlider, {ChangeResult} from "multi-range-slider-react";
import "./GoalsSettingTile.scss";
import {auth} from "../../../utils/firebase.ts";
import {stopDragging} from "../../../components/transactions/CSVUpload.tsx";

import {MoreInfo} from "../../../components/goals/MoreInfo.tsx";

export default function goalSettingTile(userPrefs: UserPrefs, forceUpdate: () => void): ReactNode {
    const [minValue, setMinValue] = useState(
        Math.round(userPrefs.getNeedsBudget() * 100)
    );
    const [maxValue, setMaxValue] = useState(
        Math.round((userPrefs.getNeedsBudget() + userPrefs.getWantsBudget()) * 100)
    );

    const needs = minValue;
    const wants = maxValue - minValue;
    const savings = 100 - maxValue;

    const disableSet = needs === Math.round(userPrefs.getNeedsBudget() * 100) && wants ===  Math.round(userPrefs.getWantsBudget() * 100);
    const disableRecommended = needs === 50 && wants === 30;

    const handleInput = (e: ChangeResult) => {
        const min = e.minValue;
        const max = e.maxValue;

        setMinValue(min);
        setMaxValue(max);
    };

    const [showInfoModal, setShowInfoModal] = useState(false);
    function closeModal(setShow: React.Dispatch<React.SetStateAction<boolean>>) {
        setShow(false);
    }
    const onInfoModalClose = () => closeModal(setShowInfoModal)

    return <>

        <div className={"card-header w-100 fw-bold"} onPointerDown={showInfoModal ? stopDragging : undefined}>
            Goals
            <MoreInfo show={showInfoModal} closeModal={onInfoModalClose}/>
            <div>
                <button className={"btn me-2"} style={{'color': '#55599e', 'position':'relative'}}

                        onClick={() => setShowInfoModal(true)}
                >
                      About 50/30/20...
                </button>
            </div>

        </div>

        <ul className="list-group list-group-flush w-100 d-flex card-body p-0">
            <li className="list-group-item align-content-stretch" style={{height: "33%"}}>
                <div className="row h-100">
                    <div className="col d-flex justify-content-center align-items-center">Needs:</div>
                    <div className="col d-flex justify-content-center align-items-center"
                         style={{color: "rgb(202, 15, 15)"}}>{needs}%
                    </div>
                </div>
            </li>
            <li className="list-group-item align-content-stretch" style={{height: "33%"}}>
                <div className="row h-100">
                    <div className="col d-flex justify-content-center align-items-center">Wants:</div>
                    <div className="col d-flex justify-content-center align-items-center"
                         style={{color: "#0000bf"}}>{wants}%
                    </div>
                </div>
            </li>
            <li className="list-group-item align-content-stretch" style={{height: "33%"}}>
                <div className="row h-100">
                    <div className="col d-flex justify-content-center align-items-center">Savings:</div>
                    <div className="col d-flex justify-content-center align-items-center"
                         style={{color: "green"}}>{savings}%
                    </div>
                </div>
            </li>
            <li className="list-group-item align-content-stretch" style={{height: "33%"}}>
                <div className="w-100"
                     onPointerDown={stopDragging}> {/* THIS LINE TOOK 1.5H */}
                    <MultiRangeSlider
                        ruler={false}
                        label={false}
                        min={0}
                        max={100}
                        step={5}
                        subSteps={false}
                        stepOnly={true}
                        minValue={minValue}
                        maxValue={maxValue}
                        baseClassName={"modified-multi-range-slider"}
                        onChange={handleInput}
                        onInput={handleInput}
                    />
                </div>
            </li>
        </ul>
        <div className={"card-footer w-100"}>
            <div className={"d-flex justify-content-between"}>
                <button className={"btn me-2" + (disableSet ? " btn-secondary" : " btn-primary")}
                        disabled={disableSet}
                        onClick={async () => {
                            await setUserPrefs(auth.currentUser!, UserPrefs.newChecked(needs / 100, wants / 100));
                            forceUpdate();
                        }}
                >
                    Set
                </button>
                <button className={"btn ms-2" + (disableRecommended ? " btn-secondary" : " btn-success")}
                        disabled={disableRecommended}
                        onClick={() => {
                            setMinValue(50);
                            setMaxValue(80);
                        }}
                >
                    Recommended
                </button>
            </div>
        </div>
    </>;
}