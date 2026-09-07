import { SelectInput, GeneralInput } from "../../components/Input";

export function Page2() {
    return (
        <div>
            <h1>This is the page 2</h1>
            <SelectInput name="roles">
                <SelectInput.Option value="admin" defaultSelected={true}>
                    admin
                </SelectInput.Option>
                <SelectInput.Option value="frontline">frontline</SelectInput.Option>
            </SelectInput>

            <GeneralInput type="text" label="Add" disabled={false}></GeneralInput>
        </div>
    );
}
