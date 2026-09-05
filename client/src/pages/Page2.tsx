import { Form } from "react-router";
import Table from "../components/Table";
import { useFormSearchParams } from "../hooks/useFormSearchParams";
import { TABLE_SAMPLE_USERS } from "../TESTINGDATA/tableData";
import Button from "../components/Button";

export function Page2() {
    const { values, submit } = useFormSearchParams({ search: "" });

    return (
        <>
            <div>This is the page 2</div>
            <Form onSubmit={submit()} className="flex gap-2 my-2">
                <input
                    type="text"
                    defaultValue={values.search}
                    name="search"
                    className="border-2 border-crimson rounded-2xl px-2"
                />
                <Button type="submit" variant="main">
                    Search
                </Button>
            </Form>
            <Table bordered rounded shadow pagination={{}}>
                <Table.Row borderedBottom>
                    <Table.Header text="Name" nowrap />
                    <Table.Header text="Contact No." nowrap />
                    <Table.Header text="Role" nowrap />
                    <Table.Header text="Branch" nowrap />
                    <Table.Header text="Status" nowrap />
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
                        <Table.Data text={user.branch} nowrap />
                        <Table.Data text={user.status} nowrap />
                    </Table.Row>
                ))}
            </Table>
        </>
    );
}
