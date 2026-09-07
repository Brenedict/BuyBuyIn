// Components
import { SelectInput, GeneralInput, SearchInput } from "../../components/Input";
import { Card } from "../../components/Card";

export function Page2() {
    return (
        <div>
            <Card isGlass={false}>
                <Card.Body className="flex flex-col gap-4">
                    <h1>This is the page 2</h1>
                    <div className="flex gap-4">
                        <SelectInput name="roles" defaultValue="admin">
                            <SelectInput.Option value="admin">admin</SelectInput.Option>
                            <SelectInput.Option value="frontline">frontline</SelectInput.Option>
                        </SelectInput>
                        <SelectInput name="roles" defaultValue="admin">
                            <SelectInput.Option value="admin">admin</SelectInput.Option>
                            <SelectInput.Option value="frontline">frontline</SelectInput.Option>
                            <SelectInput.Option value="hqadmin">hqadmin</SelectInput.Option>
                            <SelectInput.Option value="admin">admin</SelectInput.Option>
                            <SelectInput.Option value="thing">thing</SelectInput.Option>
                            <SelectInput.Option value="thing1">thing1</SelectInput.Option>
                            <SelectInput.Option value="thing2">thing2</SelectInput.Option>
                            <SelectInput.Option value="thing3">thing3</SelectInput.Option>
                            <SelectInput.Option value="thing4">thing4</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <GeneralInput type="text" label="Add" value={"Penis"}></GeneralInput>
                    <GeneralInput type="email" label="Email" disabled={false} required isRequired={true}></GeneralInput>
                    <GeneralInput type="number" label="Number" disabled={false}></GeneralInput>
                    <GeneralInput type="date" label="Number" disabled={false}></GeneralInput>
                    <GeneralInput type="text" label="Add" disabled={false}></GeneralInput>
                    <SearchInput></SearchInput>
                </Card.Body>
            </Card>
        </div>
    );
}
