// General Imports
import { Form } from "react-router";
import { useState } from "react";

// Components
import { Text } from "../../components/Text";
import Table from "../../components/Table";
import { Card } from "../../components/Card";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import { Button } from "../../components/Button";
import { DateText, EditDeleteButtons, PrimarySecondaryText } from "../../components/partials/TablePartials";

import SearchInput from "../../components/inputs/SearchInput";
import SelectInput from "../../components/inputs/SelectInput";
import GeneralInput from "../../components/inputs/GeneralInput";
import TextAreaInput from "../../components/inputs/TextAreaInput";
import ChoiceInput from "../../components/inputs/ChoiceInput";

// Test Data
import { TABLE_SAMPLE_USERS } from "../../TESTINGDATA/tableData";
import PasswordInput from "../../components/inputs/PasswordInput";

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
                    <SelectInput
                        name="roles"
                        defaultValue="cashier"
                        options={{
                            hqadmin: "hqadmin",
                            cashier: "cashier",
                            branchManager: "branchManager",
                            owner: "owner",
                        }}
                    />
                    <SelectInput
                        variant="button"
                        name="feeling"
                        defaultValue="happy"
                        options={{
                            sad: "sad",
                            happy: "happy",
                            angry: "angry",
                            ecstatic: "ecstatic",
                            jolly: "jolly",
                            brave: "brave",
                            classy: "classy",
                            loner: "loner",
                            insertText: "insertText",
                        }}
                    />
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
                        <Table.Header text="Name" />
                        <Table.Header text="Contact No." />
                        <Table.Header text="Role" />
                        <Table.Header text="Branch" />
                        <Table.Header text="Status" />
                        <Table.Header text="Created At" />
                        <Table.Header text="Action" />
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
                            <Table.Data text={user.name} />
                            <Table.Data text={user.contact} />
                            <Table.Data text={user.role} />
                            <Table.Data>
                                {(() => {
                                    const splitted = user.branch.split(", ");
                                    return <PrimarySecondaryText primary={splitted?.[0]} secondary={splitted?.[1]} />;
                                })()}
                            </Table.Data>
                            <Table.Data text={user.status} />
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
