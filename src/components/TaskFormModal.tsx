import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'])
    .required('Priority required'),
  assignedTo: Yup.string().required('Assigned to is required'),
  dueDate: Yup.date().required('Due date required'),
  status: Yup.string()
    .oneOf(['To Do', 'In Progress', 'Done'])
    .required('Status is required')
})

const priorities = ['low', 'medium', 'high']

const TaskFormModal = ({ open, onClose, onSubmit, initialValues }: any) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <Formik
        initialValues={
          initialValues || {
            title: '',
            description: '',
            priority: 'medium',
            assignedTo: '',
            dueDate: '',
            status: 'To Do'
          }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values)
          resetForm()
          onClose()
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label='Title'
                name='title'
                fullWidth
                margin='normal'
                error={!!errors.title && touched.title}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                label='Description'
                name='description'
                fullWidth
                margin='normal'
                multiline
                rows={3}
              />
              <Field
                as={TextField}
                select
                name='priority'
                label='Priority'
                fullWidth
                margin='normal'
              >
                {priorities.map(p => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                select
                name='status'
                label='Column'
                fullWidth
                margin='normal'
              >
                {['To Do', 'In Progress', 'Done'].map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                label='Assigned To'
                name='assignedTo'
                fullWidth
                margin='normal'
                error={!!errors.assignedTo && touched.assignedTo}
                helperText={touched.assignedTo && errors.assignedTo}
              />
              <Field
                as={TextField}
                type='date'
                name='dueDate'
                label='Due Date'
                fullWidth
                margin='normal'
                InputLabelProps={{ shrink: true }}
                error={!!errors.dueDate && touched.dueDate}
                helperText={touched.dueDate && errors.dueDate}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type='submit' variant='contained'>
                {initialValues ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default TaskFormModal
