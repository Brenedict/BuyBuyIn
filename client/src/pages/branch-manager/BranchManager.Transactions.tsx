// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function BranchManager_Transactions() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Branch Manager Transactions</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}
