import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function SuperAdmin_Plans() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Plans</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default SuperAdmin_Plans;
