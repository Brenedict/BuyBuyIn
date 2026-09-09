import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function HQ_Inventory() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>HQ Admin Inventory</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default HQ_Inventory;
