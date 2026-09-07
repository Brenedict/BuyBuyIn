// Components
import { SelectInput, GeneralInput, SearchInput, TextAreaInput } from "../../components/Input";
import { Card } from "../../components/Card";

export function Page2() {
    return (
        <div>
            <Card isGlass={false}>
                <Card.Body className="flex flex-col gap-4">
                    <h1>This is the page 2</h1>
                    <div className="flex gap-4">
                        <SelectInput name="roles" defaultValue="option2">
                            <SelectInput.Option value="option1">option1</SelectInput.Option>
                            <SelectInput.Option value="option2">option2</SelectInput.Option>
                            <SelectInput.Option value="option3">option3</SelectInput.Option>
                            <SelectInput.Option value="option4">option4</SelectInput.Option>
                            <SelectInput.Option value="option5">option5</SelectInput.Option>
                            <SelectInput.Option value="option6">option6</SelectInput.Option>
                            <SelectInput.Option value="option7">option7</SelectInput.Option>
                            <SelectInput.Option value="option8">option8</SelectInput.Option>
                            <SelectInput.Option value="option9">option9</SelectInput.Option>
                        </SelectInput>
                        <SelectInput variant="button" name="roles" defaultValue="option2">
                            <SelectInput.Option value="option1">option1</SelectInput.Option>
                            <SelectInput.Option value="option2">option2</SelectInput.Option>
                            <SelectInput.Option value="option3">option3</SelectInput.Option>
                            <SelectInput.Option value="option4">option4</SelectInput.Option>
                            <SelectInput.Option value="option5">option5</SelectInput.Option>
                            <SelectInput.Option value="option6">option6</SelectInput.Option>
                            <SelectInput.Option value="option7">option7</SelectInput.Option>
                            <SelectInput.Option value="option8">option8</SelectInput.Option>
                            <SelectInput.Option value="option9">option9</SelectInput.Option>
                        </SelectInput>
                    </div>
                    {/* TODO: Fix the broken styles for Label, then finish the story and PR */}
                    <GeneralInput type="text" label="Add" defaultValue={"Penis"} required placeholder=""></GeneralInput>
                    <GeneralInput
                        type="email"
                        label="Email"

                        required
                        isRequired={true}
                        placeholder="asdadas"
                        value={"Test"}
                    ></GeneralInput>
                    <GeneralInput type="number" label="Number" disabled={false}></GeneralInput>
                    <GeneralInput type="date" label="Number"></GeneralInput>

                    <div className="flex gap-6">
                        <GeneralInput type="date" label="Date" required></GeneralInput>
                        <GeneralInput type="date" label="Time" required></GeneralInput>
                    </div>
                    <SearchInput placeholder="Search here" label="Rastaaclaat" required boldLabel={false} />
                    <TextAreaInput />
                </Card.Body>
            </Card>
        </div>
    );
}
