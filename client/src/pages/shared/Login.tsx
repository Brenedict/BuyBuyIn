import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

export function Login() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Login</Text>
                <Button>Button</Button>
            </Card.Body>
        </Card>
    );
}

export default Login;
