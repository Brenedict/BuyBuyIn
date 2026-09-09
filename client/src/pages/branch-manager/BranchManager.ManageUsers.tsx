import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function BranchManager_ManageUsers() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Branch Manager Manage Users</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default BranchManager_ManageUsers;
