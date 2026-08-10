import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import JoinPage from '@/pages/join/JoinPage';
import LoginPage from '@/pages/login/LoginPage';
import ProductEditPage from '@/pages/products/ProductEditPage';
import ProductListPage from '@/pages/products/ProductListPage';
import ProductRegisterPage from '@/pages/products/ProductRegisterPage';
import CountryReportPage from '@/pages/report/CountryReportPage';
import TotalReportPage from '@/pages/report/TotalReportPage';
import DetailImagePage from '@/pages/sales/DetailImagePage';
import DetailPage from '@/pages/sales/DetailPage';
import SalesInfoPage from '@/pages/sales/SalesInfoPage';
import SalesOpsPage from '@/pages/sales/SalesOpsPage';
import StockAddPage from '@/pages/sales/StockAddPage';
import MarketConnectPage from '@/pages/settings/MarketConnectPage';
import PasswordChangePage from '@/pages/settings/PasswordChangePage';
import SettingsPage from '@/pages/settings/SettingsPage';
import { PATH } from './paths';
import RequireAuth from './RequireAuth';

export const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Navigate to={PATH.DASHBOARD} replace />,
  },
  {
    path: PATH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATH.JOIN,
    element: <JoinPage />,
  },
  {
    // 1 Depth — AppLayout이 사이드바 + 인증 가드 담당
    element: <AppLayout />,
    children: [
      {
        path: PATH.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: PATH.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: PATH.SETTINGS_MARKET_CONNECT,
        element: <MarketConnectPage />,
      },
      {
        path: PATH.PRODUCTS,
        element: <ProductListPage />,
      },
      {
        path: PATH.PRODUCT_REGISTER,
        element: <ProductRegisterPage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/edit`,
        element: <ProductEditPage />,
      },
    ],
  },
  {
    // 단독 레이아웃 (사이드바 없음) 또는 ProductShell이 사이드바·AI 패널을 자체 렌더하는 2 Depth
    element: <RequireAuth />,
    children: [
      {
        path: PATH.SETTINGS_PASSWORD,
        element: <PasswordChangePage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/report`,
        element: <TotalReportPage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/report/:countryCode`,
        element: <CountryReportPage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/sales/:countryCode`,
        element: <SalesInfoPage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/detail/:countryCode`,
        element: <DetailPage />,
      },
      {
        // 상품·상세 이미지 AI 생성 (target 쿼리로 상품 컷/상세 컷 구분)
        path: `${PATH.PRODUCTS}/:productId/detail/:countryCode/image`,
        element: <DetailImagePage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/sales-ops/:countryCode`,
        element: <SalesOpsPage />,
      },
      {
        path: `${PATH.PRODUCTS}/:productId/stock/add`,
        element: <StockAddPage />,
      },
    ],
  },
]);
