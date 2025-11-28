
'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

import { DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order, Expense } from '@/lib/types';
import { getAllOrdersQuery } from '@/services/orders';
import { getExpensesQuery } from '@/services/expenses';
import { Skeleton } from '@/components/ui/skeleton';
import { format, getMonth } from 'date-fns';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace('LKR', 'LKR ');
};

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--primary))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--destructive))',
  },
};

export default function AdminAnalyticsPage({ isAuthorized }: { isAuthorized?: boolean }) {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!isAuthorized) return null;
    return getAllOrdersQuery(firestore);
  }, [firestore, isAuthorized]);
  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const expensesQuery = useMemoFirebase(() => {
    if (!isAuthorized) return null;
    return getExpensesQuery(firestore);
  }, [firestore, isAuthorized]);
  const { data: expenses, isLoading: areExpensesLoading } = useCollection<Expense>(expensesQuery);

  const isLoading = areOrdersLoading || areExpensesLoading;

  const { kpiData, chartData } = useMemo(() => {
    if (isLoading || !orders || !expenses) {
      const emptyKpi = [
        { title: 'Total Revenue', value: 'LKR 0', icon: DollarSign },
        { title: 'Total Expenses', value: 'LKR 0', icon: Receipt },
        { title: 'Gross Profit', value: 'LKR 0', icon: TrendingUp },
        { title: 'Net Income', value: 'LKR 0', icon: Wallet },
      ];
      const emptyChart = Array.from({ length: 12 }, (_, i) => ({
        month: format(new Date(0, i), 'MMM'),
        income: 0,
        expenses: 0,
      }));
      return { kpiData: emptyKpi, chartData: emptyChart };
    }

    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const grossProfit = totalRevenue; // Simplified for now
    const netIncome = totalRevenue - totalExpenses;

    const kpi = [
      { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
      { title: 'Total Expenses', value: formatPrice(totalExpenses), icon: Receipt },
      { title: 'Gross Profit', value: formatPrice(grossProfit), icon: TrendingUp },
      { title: 'Net Income', value: formatPrice(netIncome), icon: Wallet },
    ];

    const monthlyData: { [key: number]: { income: number; expenses: number } } = Array.from({ length: 12 }, () => ({
      income: 0,
      expenses: 0,
    }));

    orders.forEach(order => {
        if(order.orderDate) {
            const month = getMonth(order.orderDate.toDate());
            monthlyData[month].income += order.amount;
        }
    });

    expenses.forEach(expense => {
        if (expense.dueDate) {
            const month = getMonth(expense.dueDate.toDate());
            monthlyData[month].expenses += expense.amount;
        }
    });
    
    const chart = Object.keys(monthlyData).map(monthIndex => ({
        month: format(new Date(0, parseInt(monthIndex)), 'MMM'),
        income: monthlyData[parseInt(monthIndex)].income,
        expenses: monthlyData[parseInt(monthIndex)].expenses,
    }));

    return { kpiData: kpi, chartData: chart };
  }, [orders, expenses, isLoading]);


  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Track your store's financial performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="bg-muted/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="bg-muted/50 border-border/50">
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>A monthly comparison of your revenue and costs.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickFormatter={(value) => formatPrice(value as number)}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
