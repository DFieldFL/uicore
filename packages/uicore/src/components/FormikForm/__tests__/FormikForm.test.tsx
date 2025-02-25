/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { act, findByText, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Formik, FormikForm, FormInput } from '../FormikForm'
import { Button } from '../../Button/Button'
import { MultiTypeInputType } from 'components/MultiTypeInput/MultiTypeInputUtils'
import { TooltipContextProvider } from '../../../frameworks/Tooltip/TooltipContext'
import userEvent from '@testing-library/user-event'

const renderFormikForm = (
  fields: React.ReactNode,
  submitMethod = jest.fn(),
  initialValues = {},
  disabled = false,
  inline = false
) => {
  return (
    <Formik initialValues={initialValues} onSubmit={submitMethod} formName="testform">
      <FormikForm disabled={disabled} inline={inline}>
        {fields}
        <Button intent="primary" type="submit" text="Submit" />
      </FormikForm>
    </Formik>
  )
}

const renderFormikFormWithoutFormName = (
  fields: React.ReactNode,
  submitMethod = jest.fn(),
  initialValues = {},
  disabled = false,
  inline = false
) => {
  return (
    <Formik initialValues={initialValues} onSubmit={submitMethod} formName="renderFormikFormWithoutFormName">
      <FormikForm disabled={disabled} inline={inline}>
        {fields}
        <Button intent="primary" type="submit" text="Submit" />
      </FormikForm>
    </Formik>
  )
}

// '.select' class for inner 'bp3-popover-wrapper' container
const findPopoverWrapperContainer = (): HTMLElement | null => document.querySelector('.bp3-popover-wrapper.select')

describe('Test basic Components', () => {
  test('should render Text component', () => {
    const { container } = render(renderFormikFormWithoutFormName(<FormInput.Text name="name" label="Name" />))
    expect(container).toMatchSnapshot()
  })
  test('should render TextArea component', () => {
    const { container } = render(renderFormikFormWithoutFormName(<FormInput.TextArea name="name" label="Name" />))
    expect(container).toMatchSnapshot()
  })
  test('should render Select component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.Select
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })
  test('should render MultiSelect component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.MultiSelect
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })
  test('should render Checkbox component', () => {
    const { container } = render(renderFormikForm(<FormInput.CheckBox name="color" label="Color" />))
    expect(container).toMatchSnapshot()
  })
  test('should render RadioGroup component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.RadioGroup
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })

  test('it should allow either a string or an element as a RadioButton label', async () => {
    const testId = 'TEST ID'
    render(
      renderFormikForm(
        <FormInput.RadioGroup
          name="color"
          label="Color"
          items={[
            { label: <span data-testid={testId}>Red</span>, value: 'red' },
            { label: 'Blue', value: 'blue' }
          ]}
        />
      )
    )

    expect(screen.getByTestId(testId)).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  test('it should display a tooltip when a RadioGroup item has a tooltipId set', async () => {
    const tooltipId = 'TOOLTIP ID'
    const tooltips = {
      [tooltipId]: 'TOOLTIP TEXT'
    }

    render(
      <TooltipContextProvider initialTooltipDictionary={tooltips}>
        {renderFormikForm(
          <FormInput.RadioGroup
            name="color"
            label="Color"
            items={[
              { label: 'Red', value: 'red' },
              { label: 'Blue', value: 'blue', tooltipId }
            ]}
          />
        )}
      </TooltipContextProvider>
    )

    expect(screen.queryByText(tooltips[tooltipId])).not.toBeInTheDocument()

    userEvent.hover(screen.getByRole('radio', { name: 'Blue' })?.parentElement?.querySelector('svg') as SVGElement)

    await waitFor(() => {
      expect(screen.getByText(tooltips[tooltipId])).toBeInTheDocument()
    })
  })

  test('should render RadioGroup component in an inline form input', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.RadioGroup
          inline
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })

  test('should render an inline RadioGroup component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.RadioGroup
          radioGroup={{ inline: true }}
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })

  test('should render an inline RadioGroup component in an inline form input', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.RadioGroup
          inline
          radioGroup={{ inline: true }}
          items={[
            { label: 'red', value: 'Red' },
            { label: 'blue', value: 'Blue' }
          ]}
          name="color"
          label="Color"
        />
      )
    )
    expect(container).toMatchSnapshot()
  })

  test('should render FileInput component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.FileInput name="file" label="Attach File" placeholder="Select file..." buttonText="Select" />
      )
    )
    expect(container).toMatchSnapshot()
  })
  test('should render Custom Input component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.CustomRender
          name="counter"
          label="Increment"
          render={formik => (
            <Button
              text="Click Me"
              onClick={() => formik.setFieldValue('counter', parseInt(formik?.values?.counter) + 1)}
            />
          )}
        />,
        jest.fn(),
        { counter: 0 }
      )
    )
    expect(container).toMatchSnapshot()
  })

  test('render formik form custom render', () => {
    const { container } = render(
      <Formik initialValues={{ field1: 'val1' }} onSubmit={jest.fn()} formName="sampleForm">
        {() => {
          return (
            <>
              <FormInput.Text name="field1" label="field1label" />
              <FormInput.CheckBox name="field2" label="field2label" tooltipProps={{ dataTooltipId: 'field2tipId' }} />
            </>
          )
        }}
      </Formik>
    )

    expect(container).toMatchSnapshot('custom render formik')
  })

  test('should render FileInput component', () => {
    const { container } = render(
      renderFormikForm(
        <FormInput.TagInput
          name="tags"
          label="Add Tag"
          items={[
            'The Godfather',
            'The Godfather: Part II',
            'The Dark Knight',
            '12 Angry Men',
            "Schindler's List",
            'Special'
          ]}
          labelFor={name => name as string}
          itemFromNewTag={newTag => newTag}
          tagInputProps={{
            openOnKeyDown: false,
            showAddTagButton: true,
            showClearAllButton: true,
            allowNewTag: true,
            placeholder: 'Enter tags...',
            getTagProps: (value, _index, _selectedItems, createdItems) => {
              return createdItems.includes(value)
                ? { intent: 'danger', minimal: true }
                : { intent: 'primary', minimal: true }
            }
          }}
        />
      )
    )
    expect(container).toMatchSnapshot()
  })
  test('should render MultiTypeInput component with Select (with useValue and selectItems)', async () => {
    const selectItems = [
      { label: 'LabelA', value: 'valuea' },
      { label: 'LabelB', value: 'valueb' },
      { label: 'LabelC', value: 'valuec' },
      { label: 'LabelD', value: 'valued' }
    ]
    const { container } = render(
      renderFormikForm(
        <FormInput.MultiTypeInput
          selectItems={selectItems}
          useValue
          multiTypeInputProps={{
            selectProps: {
              items: selectItems,
              usePortal: true,
              addClearBtn: true,

              allowCreatingNewItems: true
            },

            allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
          }}
          label={'select'}
          name={'label-multitypeinput'}
        />,
        undefined,
        { label: '' }
      )
    )
    const dropDownButton = container
      .querySelector(`[name="label-multitypeinput"] + [class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="chevron-down"]')
    fireEvent.click(dropDownButton!)
    const selectListMenu = document.body.querySelector('.bp3-menu')
    const selectItem = await findByText(selectListMenu as HTMLElement, 'LabelA')

    act(() => {
      fireEvent.click(selectItem)
    })
    const inputSelect = container.querySelector(`[name="label-multitypeinput"]`)
    expect((inputSelect as any).value).toBe('LabelA') // selected value A

    // add manual value
    act(() => {
      fireEvent.change(inputSelect!, { target: { value: 'customvalue' } })
    })
    const addButton = document.body.querySelector('.bp3-menu')?.querySelector('[icon="plus"]')
    act(() => {
      fireEvent.click(addButton!)
    })
    expect((inputSelect as any).value).toBe('customvalue') // selected value A
    const popoverWrapper = findPopoverWrapperContainer()
    expect(popoverWrapper).toMatchSnapshot()
  })
  test('should render MultiTypeInput component with Select', async () => {
    const selectItems = [
      { label: 'LabelA', value: 'valuea' },
      { label: 'LabelB', value: 'valueb' },
      { label: 'LabelC', value: 'valuec' },
      { label: 'LabelD', value: 'valued' }
    ]
    const { container } = render(
      renderFormikForm(
        <FormInput.MultiTypeInput
          selectItems={selectItems}
          multiTypeInputProps={{
            selectProps: {
              items: selectItems,
              usePortal: true,
              addClearBtn: true,
              allowCreatingNewItems: true
            },

            allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
          }}
          label={'select'}
          name={'label-multitypeinput'}
        />,
        undefined,
        { label: '' }
      )
    )
    const dropDownButton = container
      .querySelector(`[name="label-multitypeinput"] + [class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="chevron-down"]')
    fireEvent.click(dropDownButton!)
    const selectListMenu = document.body.querySelector('.bp3-menu')
    const selectItem = await findByText(selectListMenu as HTMLElement, 'LabelA')

    act(() => {
      fireEvent.click(selectItem)
    })
    const inputSelect = container.querySelector(`[name="label-multitypeinput"]`)
    expect((inputSelect as any).value).toBe('LabelA') // selected value A
    // add manual value
    act(() => {
      fireEvent.change(inputSelect!, { target: { value: 'customvalue' } })
    })
    const addButton = document.body.querySelector('.bp3-menu')?.querySelector('[icon="plus"]')
    act(() => {
      fireEvent.click(addButton!)
    })
    expect((inputSelect as any).value).toBe('customvalue') // selected value A
    const popoverWrapper = findPopoverWrapperContainer()
    expect(popoverWrapper).toMatchSnapshot()
  })

  test('Tag Input component type duplicate values CDNG-8531', async () => {
    const { container, getByPlaceholderText, getByText } = render(
      renderFormikForm(
        <FormInput.TagInput
          label={'checking my tag input'}
          name="allowedValues"
          items={[]}
          labelFor={name => (typeof name === 'string' ? name : '')}
          itemFromNewTag={newTag => newTag}
          tagInputProps={{
            noInputBorder: false,
            openOnKeyDown: false,
            showAddTagButton: false,
            showClearAllButton: true,
            allowNewTag: true,
            placeholder: 'placeholder',
            getTagProps: () => ({ intent: 'primary', minimal: true })
          }}
        />
      )
    )

    const input = getByPlaceholderText('placeholder')
    fireEvent.change(input, { target: { value: 'tag1' } })
    fireEvent.click(getByText('Create "tag1"'))
    await waitFor(() => expect(getByText('tag1')).toBeTruthy())

    fireEvent.change(input, { target: { value: 'tag2' } })
    fireEvent.click(getByText('Create "tag2"'))
    await waitFor(() => expect(getByText('tag2')).toBeTruthy())

    // enter tag2 again
    fireEvent.change(input, { target: { value: 'tag2' } })
    fireEvent.click(getByText('Create "tag2"'))

    // entering tag2 for the third time
    fireEvent.change(input, { target: { value: 'tag2' } })
    fireEvent.click(getByText('Create "tag2"'))

    // tag2 should only be seen once as saved in the snapshot
    expect(container).toMatchSnapshot()
  })
})
