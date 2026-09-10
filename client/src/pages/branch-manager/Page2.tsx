// General Imports
import { Form } from "react-router";

// Components
import Table from "../../components/Table";
import { Card } from "../../components/Card";
import { GeneralInput, PasswordInput, SearchInput, SelectInput, ChoiceInput } from "../../components/Input";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";
import { TABLE_SAMPLE_USERS } from "../../TESTINGDATA/tableData";
import { Button } from "../../components/Button";
import { DateText, EditDeleteButtons, PrimarySecondaryText } from "../../components/TablePartials";
import type { ReactNode } from "react";

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
                        {/* TODO: Add the radio and checkbox inputs */}
                        <GeneralInput
                            type="text"
                            label="Add"
                            defaultValue={"Default"}
                            isRequired
                            disabled
                            placeholder=""
                        ></GeneralInput>
                        <GeneralInput type="email" label="Email" isRequired />
                        <ChoiceInput>Agree to terms and conditions</ChoiceInput>
                        <ChoiceInput type="radio" name="terms" defaultChecked>
                            Agree
                        </ChoiceInput>
                        <ChoiceInput type="radio" name="terms">
                            Disagree
                        </ChoiceInput>
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
}
