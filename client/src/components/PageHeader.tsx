// Components
import { Text } from "../components/Text";

export function PageHeader({ headerText, descriptionText }: { headerText: string; descriptionText?: string }) {
    return (
        <div>
            <Text size="large" variant="crimson" weight="extraBold">
                {headerText}
            </Text>
            <Text size="big" variant="brown" weight="light">
                {descriptionText}
            </Text>
        </div>
    );
}
