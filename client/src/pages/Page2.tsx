import Table from "../components/Table";
import { TABLE_SAMPLE_USERS } from "../TESTINGDATA/tableData";

export function Page2() {
    return (
        <>
            <div>This is the page 2</div>
            <Table bordered rounded shadow pagination={{}}>
                <Table.Row borderedBottom>
                    <Table.Header text="Name" nowrap />
                    <Table.Header text="Contact No." nowrap />
                    <Table.Header text="Role" nowrap />
                    <Table.Header text="Branch" nowrap />
                    <Table.Header text="Status" nowrap />
                </Table.Row>

                {TABLE_SAMPLE_USERS.map((user, i) => (
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
