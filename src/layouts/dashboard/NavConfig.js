// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

import LOCALIZATIONPACK from '../../localization/str';

const navstring = LOCALIZATIONPACK.nav;

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: navstring.dashboard,
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  // {
  //   title: 'Contrib | 投稿',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: 'Post | 浏览评教',
    path: '/dashboard/blog',
    icon: getIcon('dashicons:welcome-learn-more'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
