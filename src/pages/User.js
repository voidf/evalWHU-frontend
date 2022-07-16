import axios from 'axios';

import * as React from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// material
import {
  Box,
  Card,
  Table,
  Stack,
  Link,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  CardContent,
  Typography,
  TableContainer,
  TablePagination,
  Collapse,
  ListItemButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import SvgIconStyle from '../components/SvgIconStyle';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'teacher', label: '任课教师', alignRight: false },
  { id: 'course', label: '课程名称', alignRight: false },
  // { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];


const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  // WebkitLineClamp: 4,
  // display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const NameStyle = styled('div')(({ theme }) => ({
  height: 44,
  zIndex: 9,
  position: 'absolute',
  left: theme.spacing(10),
  color: theme.palette.text.disabled,
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, key) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user[key].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function Elem({ elem, isItemSelected, handleClick, itemClick, ...props }) {

  const { _id, course, teacher, content } = elem;




  return (
    <TableRow
      onClick={(event) => itemClick(event, elem)}
      hover
      key={_id.$oid}
      tabIndex={-1}
      role="checkbox"
      selected={isItemSelected}
      style={{ height: 53 }}
      aria-checked={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id.$oid)} />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={teacher} src={'/'} />
          <Typography variant="subtitle2" noWrap>
            {teacher}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">{course}</TableCell>

      <TableCell align="right">
        <UserMoreMenu />
      </TableCell>


    </TableRow>
  );
}


function Cmt({ content, ...props }) {
  return (
    <Accordion
      sx={{
        //
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Stack>
          <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            sx={{
              typography: 'h5',
              height: 60,
              color: 'text.primary',
            }}
          >
            {content.scoring}
          </TitleStyle>
          <InfoStyle>
            <Box
              sx={{
                display: 'flex',
                top: 50,
                left: 15,
                position: 'absolute',
                alignItems: 'center',
                // ml: -5,
                ...((false) && {
                  color: 'grey.500',
                }),
              }}
            >
              {content.examination && (
                <>
                  <Iconify icon="healthicons:i-exam-multiple-choice" sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ mr: 1 }}>{content.examination}</Typography>
                </>
              )}
              {content.type && (
                <>
                  <Iconify icon="ic:baseline-class" sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ mr: 1 }}>{content.type}</Typography>
                </>
              )}
              {content.score && (
                <>
                  <Iconify icon="dashicons:welcome-learn-more" sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ mr: 1 }}>{content.score}学分</Typography>
                </>
              )}
              {content.rating && (
                <>
                  <Iconify icon="ant-design:star-filled" sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ mr: 1 }}>{content.rating}</Typography>
                </>
              )}
              {content.material && content.material.length > 0 && (
                <>
                  <Iconify icon="bxs:book-heart" sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ mr: 1 }}>推荐教材: {content.material.join(", ")}</Typography>
                </>
              )}
            </Box>
          </InfoStyle>

        </Stack>

      </AccordionSummary>
      <AccordionDetails>
        {content.intro && (
          <>
            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle3"
              underline="hover"
              component={RouterLink}
              sx={{
                typography: 'h6',
                height: 60,
                color: 'text.primary',
              }}
            >
              课程内容
            </TitleStyle>
            <Typography gutterBottom variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {content.intro}
            </Typography>
            <br />
            <br />
          </>
        )}
        {content.comment && (
          <Typography gutterBottom variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {content.comment}
          </Typography>
        )}
        {content.appendix && (
          <Typography gutterBottom variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            PS:{content.appendix}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('course');

  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [req, sreq] = useState(true);

  const [elem, selem] = useState(undefined);

  const [data, sdata] = useState([{
    "_id": {
      "$oid": "62a4b0a2f9df0c75ccd6dbb0"
    },
    "course": "微积分",
    "teacher": "周小方",
    "content": [
      {
        "comment": "好好听课 老师捞人",
        "material": []
      },
      {
        "comment": "老师真的很好",
        "scoring": "特别好，会捞人",
        "material": [],
        "appendix": "选小方老师课的人一定要好好听课，不听课感觉都对不起他😭"
      }
    ]
  }]);

  useEffect(
    () => {
      if (req) {
        axios.get(`/post.20220713145216.json`).then((resp) => {
          sdata(resp.data);
          console.log(resp.data);
          sreq(false);
        });
      }
    }
  );


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fdata.map((n) => n._id.$oid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTeacher = (event) => {
    setFilterTeacher(event.target.value);
  };
  const handleFilterByCourse = (event) => {
    setFilterCourse(event.target.value);
  };


  const fdata =
    applySortFilter(
      applySortFilter(data, getComparator(order, orderBy), filterTeacher, 'teacher')
      , getComparator(order, orderBy), filterCourse, 'course'
    )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - fdata.length;

  const isUserNotFound = fdata.length === 0;


  const itemClick = (event, item) => {
    if (elem && item._id.$oid === elem._id.$oid) selem(undefined);
    else selem(item);
    setScroll("paper");
    console.log([event, item]);
  };

  const [scroll, setScroll] = React.useState('paper');

  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll("paper");
  // };

  const handleClose = () => {
    // setOpen(false);
    selem(undefined);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (elem) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [elem]);

  return (
    <Page title="浏览评教">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            浏览评教
          </Typography>

        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} f1={filterTeacher} of1={handleFilterByTeacher} f2={filterCourse} of2={handleFilterByCourse} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={fdata.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {fdata.map((row) => {
                    const isItemSelected = selected.indexOf(row._id.$oid) !== -1;

                    return (
                      <Elem key={row._id.$oid} elem={row} isItemSelected={isItemSelected} handleClick={handleClick} itemClick={itemClick} />
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterTeacher} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog
          open={elem !== undefined}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">评教详情</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            {elem && (
              <Card sx={{ position: 'relative', minWidth:'35em'}}>


                <CardMediaStyle
                  sx={{
                    ...({
                      pt: 'calc(100% * 4 / 3)',
                      '&:after': {
                        top: 0,
                        content: "''",
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      },
                    }),
                    ...(true && {
                      pt: {
                        xs: 'calc(100% * 4 / 3)',
                        // sm: 'calc(100% * 1 / 4.66)', // 这里改banner高度
                        sm: 'calc(100% * 2 / 4.66)', // 这里改banner高度
                      },
                    }),
                  }}
                >

                  <SvgIconStyle
                    color="paper"
                    src="/static/icons/shape-avatar.svg"
                    sx={{
                      width: 80,
                      height: 36,
                      zIndex: 9,
                      bottom: -15,
                      position: 'absolute',
                      color: 'background.paper',
                    }}
                  />

                  <AvatarStyle
                    alt={elem.teacher}
                    src={'/'}
                    sx={{
                      zIndex: 9,
                      top: 24,
                      left: 24,
                      width: 40,
                      height: 40,
                    }}
                  />



                  <CoverImgStyle alt={'IMG'} src={'/samplebg3.jpg'} />
                  {/* 这种写法可以写进去 */
              /*
               <div sx={{
                top: 0,
                width: '100%',
                position: 'absolute',
              }}>

                <Cmt elem={elem} />
                <Cmt elem={elem} />
                <Cmt elem={elem} />

            </div> */}

                </CardMediaStyle>
                <NameStyle
                  to="#"
                  color="inherit"
                  variant="subtitle2"
                  underline="hover"
                  component={RouterLink}
                  sx={{
                    typography: 'h5',
                    top: 30,

                    height: 60,
                    position: 'absolute',
                    color: 'common.white',
                  }}
                >
                  {elem.teacher}  &nbsp;-&nbsp;  {elem.course}
                </NameStyle>


                <CardContent
                  sx={{
                    pt: 4,
                    ...((true) && {
                      bottom: 0,
                      width: '100%',
                      // height: 'auto',
                      // position: 'absolute',
                    }),
                  }}
                >
                  {elem.content.map((i, p) => (<Cmt key={p} content={i} />))}


                </CardContent>
              </Card>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Back</Button>
            {/* <Button onClick={handleClose}>Subscribe</Button> */}
          </DialogActions>
        </Dialog>
      </Container>
    </Page >
  );
}
