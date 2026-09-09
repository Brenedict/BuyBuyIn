import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function Cashier_PointOfSale() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Cashier Point of Sale</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default Cashier_PointOfSale;
