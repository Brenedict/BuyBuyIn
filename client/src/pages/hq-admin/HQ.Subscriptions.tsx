import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function HQ_Subscriptions() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>HQ Admin Subscriptions</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default HQ_Subscriptions;
