// General Import
import { useState } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import { EditDeleteButtons } from "../../components/TablePartials";

// Mock Data
const SUBSCRIBERS_DATA = [
    { id: 1, lastName: "Santos", firstName: "Maria", username: "mariasantos03", businessName: "Santos Fashion Boutique" },
    { id: 2, lastName: "Reyes", firstName: "John", username: "johnreyes_", businessName: "Reyes Hardware Supply" },
    { id: 3, lastName: "Cruz", firstName: "Angela", username: "angelacruz42", businessName: "GlowUp Beauty Studio" },
    { id: 4, lastName: "Navarro", firstName: "Bianca", username: "biancanav", businessName: "Luxe Beauty Essentials" },
    { id: 5, lastName: "Villanueva", firstName: "Carlo", username: "carlovill4", businessName: "CV Office Supplies" },
    { id: 6, lastName: "Mendoza", firstName: "Daniel", username: "danmendoza", businessName: "HomeCraft Furniture" },
    { id: 7, lastName: "Lim", firstName: "Adrian", username: "adrianlim_08", businessName: "Urban Living Home Décor" },
];

export function SuperAdmin_SubscriberAccounts() {
    const handleEdit = (id: string | number) => () => {
        alert(`Edit subscriber: ${id}`);
    };

    const handleDelete = (id: string | number) => () => {
        alert(`Delete subscriber: ${id}`);
    };

    return (
            <Card className="w-full">
                <Card.Body className="flex flex-col gap-10">
                    
                    <div className="flex flex-col gap-2 border-b border-gray-300 pb-4">
                        <Text weight="extraBold" size="large" variant="crimson">
                            Subscriber Account
                        </Text>
                    </div>

                <Card isGlass={true}>
                    <Card.Header 
                        toggleRightButton 
                        rightButton={<Button variant="main" className="border-none" outline-none ring-0 shadow-none >Add Subscriber</Button>} 
                        bordered={false}
                    >
                        <Text weight="bold" size="bigger" variant="crimson">
                            Subscriber Account
                        </Text>
                    </Card.Header>

                    <Card.Body>
                        <Table 
                            bordered 
                            rounded 
                            shadow 
                            pagination={{
                                bgVariant: 'cream-muted',
                                borderVariant: 'brown',
                                borderedTop: true,
                                maxItems: 6,
                                textSize: 'description',
                                textVariant: 'crimson',
                                textWeight: 'medium'
                            }}
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Last Name" />
                                <Table.Header text="First Name" />
                                <Table.Header text="Username" />
                                <Table.Header text="Business Name" />
                                <Table.Header text="Actions" />
                            </Table.Row>

                            {SUBSCRIBERS_DATA.map((sub) => (
                                <Table.Row key={sub.id}>
                                    <Table.Data size="normal" text={sub.lastName} />
                                    <Table.Data size="normal" text={sub.firstName} />
                                    <Table.Data size="normal" text={sub.username} />
                                    <Table.Data size="normal" text={sub.businessName} />
                                    <Table.Data>
                                        <EditDeleteButtons 
                                            id={sub.id} 
                                            handleEdit={handleEdit} 
                                            handleDelete={handleDelete} 
                                        />
                                    </Table.Data>
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>

            </Card.Body>
        </Card>
    );
}

export default SuperAdmin_SubscriberAccounts;