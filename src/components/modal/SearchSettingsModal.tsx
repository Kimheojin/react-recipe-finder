import ConditionalRecipe from "./ConditionalRecipe";
import AutocompleteSwitch from "./AutocompleteSwitch";
import "./SearchSettingsModal.css";
import { useState } from "react";

export default function SearchSettingsModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div className="dialog-root">
            <a className="link" onClick={openModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>검색 설정</a>

            {isOpen && (
                <div className="portal">
                    <div className="dialog-backdrop" onClick={closeModal}></div>
                    <div className="dialog-positioner search-settings-positioner">
                        <div className="dialog-content">
                            <div className="dialog-header search-settings-dialog-header">
                                <h2 className="dialog-title">검색 설정</h2>
                            </div>
                            <div className="dialog-body">
                                <div className="vstack search-settings-header">
                                    <h1>통합 검색 조건</h1>
                                    <ConditionalRecipe />
                                    <h1>자동완성 조건</h1>
                                    <AutocompleteSwitch />
                                </div>
                            </div>
                            <button className="close-button" onClick={closeModal}>X</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
