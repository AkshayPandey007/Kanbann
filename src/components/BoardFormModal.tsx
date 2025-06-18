import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Board name is required'),
});

// Custom Formik Field Adapter for MUI TextField
const FormikTextField = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  return (
    <TextField
      fullWidth
      label={label}
      {...field}
      {...props}
      error={!!isError}
      helperText={isError ? meta.error : ''}
    />
  );
};

const BoardFormModal = ({ open, onClose, onSubmit, initialValues = { name: '' }, }: any) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>{initialValues?._id ? 'Edit Board' : 'Create Board'}</DialogTitle>
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
        onClose();
      }}
    >
      {() => (
        <Form>
          <DialogContent>
            <FormikTextField name="name" label="Board Name" />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {initialValues?._id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  </Dialog>
);

export default BoardFormModal;
