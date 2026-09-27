import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Outlet } from "react-router";

export function Cashier_Transactions() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Cashier Transactions</Text>
                <Button>Button</Button>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default Cashier_Transactions;
