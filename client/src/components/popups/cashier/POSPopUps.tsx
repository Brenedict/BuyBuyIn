// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";
import KeyboardOverlay from "../../KeyboardOverlay";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";
import { PopUpUse } from "../../../stories/PopUp.stories";

export function QtyPopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Enter Product Quantity">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Quantity
                </Text>
                <GeneralInput placeholder="e.g. 2,3 10" type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function AddItemPopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Enter Product">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Quantity
                </Text>
                <GeneralInput placeholder="e.g. 2,3 10" type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function DiscountPopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Apply Discount">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    PWD/Senior ID
                </Text>
                <GeneralInput placeholder="e.g. 109028019" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Name
                </Text>
                <GeneralInput placeholder="e.g. Jose Rizal" type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}

export function CheckPricePopUp() {
    //TODO:change the value to the standardized format
    const gap = "gap-[1rem]";
    return (
        <PopUp title="Check Price">
            <form className={`flex flex-col ${gap}`}>
                <Text size="mediumBig" weight="medium">
                    Product Name/ID
                </Text>
                <GeneralInput placeholder="e.g. Tomato sauce" type="text"></GeneralInput>
                <Text size="mediumBig" weight="medium">
                    Price
                </Text>
                <GeneralInput placeholder="..." disabled type="text"></GeneralInput>
                {/*<KeyboardOverlay></KeyboardOverlay>*/}
                <div className="flex flex-row gap-[2rem] justify-center">
                    <Button size="medium">Apply</Button>
                    <Button size="medium" variant="grey">
                        Cancel
                    </Button>
                </div>
            </form>
        </PopUp>
    );
}
