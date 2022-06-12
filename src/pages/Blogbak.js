import { useState } from 'react';
import axios from 'axios';


import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

// material
import { Grid, Button, Container, Stack, Typography, Autocomplete, TextField, Box, Divider } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import { default as U, jwt } from '../api/urls';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function Blog() {

  const [course, setcourse] = useState('');
  const [teacher, setteacher] = useState('');
  const [comment, setcomment] = useState('');
  const [score, setscore] = useState(0.0);
  const [scoring, setscoring] = useState('');
  const [material, setmaterial] = useState([]);
  const [appendix, setappendix] = useState('');
  const [examination, setexamination] = useState('');
  const [intro, setintro] = useState('');
  const [type, settype] = useState('');

  const typeselection = [
    { label: '公共选修' },
    { label: '公共必修' },
    { label: '专业选修' },
    { label: '专业必修' },
  ]
  const schema1 = Yup.object().shape({
    course: Yup.string().required("课程名不能为空"),
    teacher: Yup.string().required("教师名不能为空"),
  });

  const formik = useFormik({
    initialValues: {
      course: '',
      teacher: '',
    },
    validationSchema: schema1,
    onSubmit: (values, { setSubmitting }) => {
      // const formData = new FormData();
      // formData.append("username", values.handle);
      // formData.append("password", values.password);
      console.log(values);

      axios.post(U(`/auth/register`),).then(resp => {
        setSubmitting(false);

        // if(resp.status !== 200 || !('jwt' in resp.data))
        // {
        //   alert(`${STRINGS.registerFailed}${resp.data}`);
        //   return;
        // }
        // jwt.value = resp.data.jwt;
        // axios.defaults.headers.common.jwt = jwt;

        // navigate('/dashboard', { replace: true });
      }).catch((reason) => {
        // setSubmitting(false);

        // if(reason.response.status === 400)
        // {
        //   if(reason.response.data.detail === 'user handle already exists')
        //   {
        //     alert(`${STRINGS.alreadyExists}\n${reason.response.data.detail}`);
        //   }
        //   else if(reason.response.data.detail === 'handle or password cannot be empty')
        //   {
        //     alert(`${STRINGS.cannotEmpty}\n${reason.response.data.detail}`);
        //   }
        //   return;
        // }
        // alert(reason);
      });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;


  return (
    <Page title="新建投稿">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Contrib | 投稿
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            确认投递
          </Button>
        </Stack>

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

            <Stack spacing={1} mb={5} direction="row" justifyContent="flex-end" divider={<Divider orientation="vertical" />}>
              <Autocomplete id='m_type' options={[
                { label: '公共选修' },
                { label: '公共必修' },
                { label: '专业选修' },
                { label: '专业必修' },
              ]}
                sx={{ width: 150 }}
                renderInput={(params) =>
                  <TextField onChange={(x) => settype(x.target.value)} {...params} defaultValue={type} id="outlined-search" label="课程性质" />} />
              <Autocomplete id='m_examination' options={[
                { label: '论文' },
                { label: '考试' },
              ]}
                sx={{ width: 150 }}
                renderInput={(params) =>
                  <TextField onChange={(x) => setexamination(x.target.value)} {...params} defaultValue={examination} id="outlined-search" label="考核方式" />} />
            </Stack>



            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: 0.483 },
              }}
              noValidate
              autoComplete="off"
              spacing={3}
            >
              {/* <Stack spacing={3} direction="row"> */}
              <TextField onChange={(x) => setcourse(x.target.value)} defaultValue={course} error={course.length === 0} helperText="此栏必填" id="m_course" label="课程完整名称" type="search" />
              <TextField onChange={(x) => setteacher(x.target.value)} defaultValue={teacher} error={teacher.length === 0} helperText="此栏必填" id="m_teacher" label="任课教师" type="search" />
              <Divider orientation="horizon" mb={3} />
              <TextField defaultValue={score} id="m_score" label="学分数量" type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField defaultValue={scoring} id="outlined-search" label="给分情况" type="search" />
              <TextField defaultValue={intro} id="outlined-search" label="课程内容" type="search" />
              <Divider orientation="horizon" />
              <TextField multiline rows={9} defaultValue={comment} id="outlined-search" label="你的体验" type="search" />
              <TextField multiline rows={9} defaultValue={appendix} id="outlined-search" label="补充说明" type="search" />
              {/* </Stack> */}
            </Box>

          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
