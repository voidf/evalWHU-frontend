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
import { U, jwt } from '../api/urls';

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

  const J = (x) => JSON.stringify(x);


  const schema1 = Yup.object().shape({
    course: Yup.string().required("课程名不能为空"),
    teacher: Yup.string().required("教师名不能为空"),
    comment: Yup.string(),
    score: Yup.number(),
    scoring: Yup.string(),
    appendix: Yup.string(),
    examination: Yup.string(),
    intro: Yup.string(),
    type: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      course: '',
      teacher: '',
      comment: '',
      score: 0.0,
      scoring: '',
      appendix: '',
      examination: '',
      intro: '',
      type: '',
    },
    validationSchema: schema1,
    onSubmit: (values, { setSubmitting }) => {
      // const formData = new FormData();
      // formData.append("username", values.handle);
      // formData.append("password", values.password);
      console.log(values);

      axios.post(U(`/contrib`), 
        {
          c:{course: values.course, teacher: values.teacher},
          m:{
            comment: values.comment,
            score: values.score,
            scoring: values.scoring,
            appendix: values.appendix,
            examination: values.examination,
            intro:values.intro,
            type: values.type,
          }
        }
      ).then(resp => {
        setSubmitting(false);

        if(resp.status !== 200)
        {
          alert(`${J(resp.data)}`);
          return;
        }
        prompt(`投递成功，请把以下信息拷贝发送给管理员以便快速通过~`,`${J(resp.data)}`);


        // navigate('/dashboard', { replace: true });
      }).catch((reason) => {
        setSubmitting(false);
        alert(`${reason.response.status}\n${J(reason.response.data)}`);

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
          {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            确认投递
          </Button> */}
        请注意投稿之后需要经过管理员审核才能显示，请积极联系管理员吧~
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
                sx={{ width: 250 }}
                renderInput={(params) =>
                  <TextField  {...getFieldProps('type')}
                    type="search"
                    {...params}
                    autoComplete="type" label="课程性质" />} />
              <Autocomplete id='m_examination' options={[
                { label: '论文' },
                { label: '考试' },
              ]}
                sx={{ width: 250 }}
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
              <TextField {...getFieldProps('course')}
                type="search"
                autoComplete="course" label="课程完整名称"
                error={Boolean(touched.course && errors.course)}
                helperText={touched.course && errors.course} />
              <TextField {...getFieldProps('teacher')}
                type="search"
                defaultValue={teacher} autoComplete="teacher" label="任课教师"
                error={Boolean(touched.teacher && errors.teacher)}
                helperText={touched.teacher && errors.teacher} />

              {/* <TextField onChange={(x) => setteacher(x.target.value)} defaultValue={teacher} error={teacher.length === 0} helperText="此栏必填" id="m_teacher" label="任课教师" type="search" /> */}
              <Divider orientation="horizon" mb={3} />

              <TextField {...getFieldProps('score')}
                type="number"
                autoComplete="score" label="学分数量"
                error={Boolean(touched.score && errors.score)}
                helperText={touched.score && errors.score} />

              {/* <TextField defaultValue={score} id="m_score" label="学分数量" type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
              <TextField {...getFieldProps('scoring')}
                type="search"
                autoComplete="scoring" label="给分情况"
                error={Boolean(touched.scoring && errors.scoring)}
                helperText={touched.scoring && errors.scoring} />

              {/* <TextField defaultValue={scoring} id="outlined-search" label="给分情况" type="search" /> */}
              <TextField defaultValue={intro} id="outlined-search" label="课程内容" type="search" />
              <Divider orientation="horizon" />
              <TextField {...getFieldProps('comment')}
                type="search"
                autoComplete="comment" label="你的体验"
                error={Boolean(touched.comment && errors.comment)}
                multiline rows={9}
                helperText={touched.comment && errors.comment} />
              {/* <TextField multiline rows={9} defaultValue={comment} id="outlined-search" label="你的体验" type="search" /> */}
              <TextField {...getFieldProps('appendix')}
                type="search"
                autoComplete="appendix" label="补充说明"
                error={Boolean(touched.appendix && errors.appendix)}
                multiline rows={9}
                helperText={touched.appendix && errors.appendix} />
              {/* <TextField multiline rows={9} defaultValue={appendix} id="outlined-search" label="补充说明" type="search" /> */}
              {/* </Stack> */}
            </Box>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              确认投递
            </LoadingButton>

          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
