import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChoiceInput } from "../../components/Input";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";

import "../../index.css";

const choiceInputMeta = {
    title: "All-Components/Input-Components/Choice",
    component: ChoiceInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        children: "default",
        inputVariant: "checkbox",
        name: "default",
        defaultChecked: false,
    },
} satisfies Meta<typeof ChoiceInput>;

export default choiceInputMeta;
type Story = StoryObj<typeof choiceInputMeta>;

export const ChoiceInputCheckbox: Story = {
    args: {
        name: "consent",
        children: "I consent to this",
        stylized: false,
        inputVariant: "checkbox",
    },
    render: (args) => <ChoiceInput {...args}>{args.children}</ChoiceInput>,
};

export const MultiChoiceInputUse: Story = {
    render: () => (
        <div className="flex gap-3">
            <Text size="description" variant="black" weight="regular">
                Allergies:
            </Text>
            <ChoiceInput name="nutAllergy" inputVariant="checkbox" stylized={false}>
                Nuts
            </ChoiceInput>
            <ChoiceInput name="chocoAllergy" inputVariant="checkbox" stylized={false}>
                Chocolate
            </ChoiceInput>
        </div>
    ),
};

export const ChoiceInputRadio: Story = {
    parameters: {
        docs: {
            description: {
                story: "When using the `inputVariant` for radio, make sure to assign each radio componenent a similar `name` attribute to group them as one. You can also assign one of them to be the default `checked` item by assigning it the attribute `defaultChecked`",
            },
        },
    },
    args: {
        stylized: false,
        inputVariant: "radio",
    },
    render: (args) => (
        <div>
            <Text size="description" variant="black" weight="regular">
                Feeling:
            </Text>
            <div className="flex gap-5">
                <ChoiceInput {...args} value="Happy" id="happy" name="feel" defaultChecked>
                    Happy
                </ChoiceInput>
                <ChoiceInput {...args} value="Sad" id="sad" name="feel">
                    Sad
                </ChoiceInput>
                <ChoiceInput {...args} value="Angry" id="angry" name="feel">
                    Angry
                </ChoiceInput>
            </div>

            <Text size="description" variant="black" weight="regular">
                Sex:
            </Text>
            <div className="flex gap-5">
                <ChoiceInput {...args} value="Male" id="male" name="sexOrientation" defaultChecked>
                    Male
                </ChoiceInput>
                <ChoiceInput {...args} value="Female" id="female" name="sexOrientation">
                    Female
                </ChoiceInput>
            </div>
        </div>
    ),
};

export const FormUsage: Story = {
    parameters: {
        docs: {
            description: {
                story: "Try ticking the checkboxes and hit the save button. Go to the console to see the data displayed. This merely showcases that the checkboxes/radio data can be obtain from the component. However you still need another checking to send the data for unticked checkboxes.",
            },
        },
    },
    render: () => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());

                console.log(data);
            }}
        >
            <div className="flex gap-2">
                <ChoiceInput inputVariant="checkbox" stylized={true} name="firstTimeJobSeeker" value="true">
                    First Time Job Seeker
                </ChoiceInput>
                <ChoiceInput inputVariant="checkbox" stylized={true} name="personWithDisability" value="true">
                    Person With Disability (PWD)
                </ChoiceInput>
                <ChoiceInput inputVariant="checkbox" stylized={true} name="seniorCitizen" value="true">
                    Senior Citizen
                </ChoiceInput>
                <ChoiceInput inputVariant="checkbox" stylized={true} name="youngWorker" value="true">
                    Young Worker
                </ChoiceInput>
                <ChoiceInput inputVariant="checkbox" stylized={true} name="student" value="true">
                    Student
                </ChoiceInput>
            </div>
            <div className="flex gap-2">
                <ChoiceInput
                    inputVariant="radio"
                    stylized={true}
                    value="Male"
                    id="male"
                    name="sexOrientation"
                    defaultChecked
                >
                    Male
                </ChoiceInput>
                <ChoiceInput inputVariant="radio" stylized={true} value="Female" id="female" name="sexOrientation">
                    Female
                </ChoiceInput>
            </div>
            <Button className="my-3" size="small" variant="main" type="submit">
                Save
            </Button>
        </form>
    ),
};
