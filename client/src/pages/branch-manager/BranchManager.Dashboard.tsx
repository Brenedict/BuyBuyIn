import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function BranchManager_Dashboard() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Branch Manager Dashboard</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default BranchManager_Dashboard;
