import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Calculator } from "../../components/Calculator";

export function Cashier_PointOfSale() {
    return (
        <div>
            <Card>
                <Card.Body className="flex flex-col gap-6">
                    <Text>Cashier Point of Sale</Text>
                    <Button>Button</Button>
                </Card.Body>
            </Card>
            <Calculator />
        </div>
    );
}

export default Cashier_PointOfSale;
