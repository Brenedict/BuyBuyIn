// General Imports
import { Form } from "react-router";
import { useState } from "react";

// Components
import { Text } from "../../components/Text";
import Table from "../../components/Table";
import { Card } from "../../components/Card";
import {
    GeneralInput,
    PasswordInput,
    SearchInput,
    SelectInput,
    ChoiceInput,
    TextAreaInput,
} from "../../components/Input";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import { Button } from "../../components/Button";
import { DateText, EditDeleteButtons, PrimarySecondaryText } from "../../components/TablePartials";

// Test Data
import { TABLE_SAMPLE_USERS } from "../../TESTINGDATA/tableData";

function FormSection() {
    const [isFormValid, setIsFormValid] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        setIsFormValid(e.currentTarget.checkValidity());
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confPassword") as string;

        if (isFormValid && password === confirmPassword) {
            const data = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(data);
            alert(data);
        } else {
            setPasswordError("Passwords don't match");
            setIsFormValid(false);
        }
    };

    return (
        <>
            <Text size="bigger" weight="bold">
                This is a sample Form Section
            </Text>
            <Text variant="black">
                Note: All inputs should have a 'name' attribute in order to be collected by the form element.
            </Text>
            <Form onChange={handleFormChange} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <SelectInput name="roles" defaultValue="cashier">
                        <SelectInput.Option value="hqadmin">hqadmin</SelectInput.Option>
                        <SelectInput.Option value="cashier">cashier</SelectInput.Option>
                        <SelectInput.Option value="branchManager">branchManager</SelectInput.Option>
                        <SelectInput.Option value="owner">owner</SelectInput.Option>
                    </SelectInput>
                    <SelectInput variant="button" name="feeling" defaultValue="happy">
                        <SelectInput.Option value="sad">sad</SelectInput.Option>
                        <SelectInput.Option value="happy">happy</SelectInput.Option>
                        <SelectInput.Option value="angry">angry</SelectInput.Option>
                        <SelectInput.Option value="ecstatic">ecstatic</SelectInput.Option>
                        <SelectInput.Option value="jolly">jolly</SelectInput.Option>
                        <SelectInput.Option value="brave">brave</SelectInput.Option>
                        <SelectInput.Option value="classy">classy</SelectInput.Option>
                        <SelectInput.Option value="loner">loner</SelectInput.Option>
                        <SelectInput.Option value="insertText">insertText</SelectInput.Option>
                    </SelectInput>
                </div>
                <GeneralInput name="email" type="email" label="Email" required id="email" />
                <PasswordInput name="password" label="Password" required id="password" />
                <PasswordInput
                    label="Confirm Password"
                    required
                    name="confPassword"
                    id="confPassword"
                    error={passwordError}
                    onChange={() => setPasswordError("")}
                />
                <ChoiceInput name="terms" label="Terms" required id="terms">
                    Agree to terms and conditions
                </ChoiceInput>
                <ChoiceInput name="sex" type="radio" required label="Sex" id="male">
                    Male
                </ChoiceInput>
                <ChoiceInput name="sex" type="radio" id="female">
                    Female
                </ChoiceInput>
                <TextAreaInput label="Add your suggestions" disabled />
                <Button>Submit</Button>
            </Form>
        </>
    );
}

export function Page2() {
    const { values, submit } = useFormSearchParams({ search: "" });

    const handleEdit = (id: string | number) => () => {
        alert(`Edit: ${id}`);
    };

    const handleDelete = (id: string | number) => () => {
        alert(`Delete: ${id}`);
    };

    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Form onSubmit={submit()} className="flex gap-2 my-2">
                    <SearchInput name="search" defaultValue={values.search} />
                </Form>
                <Table bordered rounded shadow pagination={{}}>
                    <Table.Row borderedBottom>
                        <Table.Header text="Name" nowrap />
                        <Table.Header text="Contact No." nowrap />
                        <Table.Header text="Role" nowrap />
                        <Table.Header text="Branch" nowrap />
                        <Table.Header text="Status" nowrap />
                        <Table.Header text="Created At" nowrap />
                        <Table.Header text="Action" nowrap />
                    </Table.Row>

                    {/*
                     * NOTE:
                     * Example lang to, ginamitan ko ng direct filter for demo lang
                     * ideally sa loader ka ng router maghahandle  ng filters
                     * pwede mo makuha dun mismo yung mga params
                     */}
                    {TABLE_SAMPLE_USERS.filter(
                        (user) =>
                            user.name.toLowerCase().includes(values.search.toLowerCase()) ||
                            user.contact.toLowerCase().includes(values.search.toLowerCase()) ||
                            user.role.toLowerCase().includes(values.search.toLowerCase()) ||
                            user.branch.toLowerCase().includes(values.search.toLowerCase()) ||
                            user.status.toLowerCase().includes(values.search.toLowerCase())
                    ).map((user, i) => (
                        <Table.Row key={i}>
                            <Table.Data text={user.name} nowrap />
                            <Table.Data text={user.contact} nowrap />
                            <Table.Data text={user.role} nowrap />
                            <Table.Data>
                                {(() => {
                                    const splitted = user.branch.split(", ");
                                    return <PrimarySecondaryText primary={splitted?.[0]} secondary={splitted?.[1]} />;
                                })()}
                            </Table.Data>
                            <Table.Data text={user.status} nowrap />
                            <Table.Data>
                                <DateText date={user.createdAt} type="datetime" />
                            </Table.Data>
                            <Table.Data>
                                <EditDeleteButtons id={i} handleEdit={handleEdit} handleDelete={handleDelete} />
                            </Table.Data>
                        </Table.Row>
                    ))}
                </Table>

                <Card isGlass={false}>
                    <Card.Body className="flex flex-col gap-4">
                        <FormSection />
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
}
