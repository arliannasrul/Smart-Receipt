import { Receipt } from "@/app/actions/receipts";

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  name: string;
  value: number;
}

export const processSpendingData = (receipts: Receipt[]): MonthlySpending[] => {
  const spendingMap: Record<string, number> = {};

  receipts.forEach((receipt) => {
    const date = new Date(receipt.date);
    // Format: "MMM YY" (e.g., "Jan 24")
    const monthKey = new Intl.DateTimeFormat("id-ID", {
      month: "short",
      year: "2-digit",
    }).format(date);

    spendingMap[monthKey] = (spendingMap[monthKey] || 0) + receipt.amount;
  });

  // Sort by date
  const sortedMonths = Object.keys(spendingMap).sort((a, b) => {
    const parseMonth = (str: string) => {
      const [m, y] = str.split(" ");
      return new Date(`01 ${m} 20${y}`).getTime();
    };
    return parseMonth(a) - parseMonth(b);
  });

  return sortedMonths.map((month) => ({
    month,
    amount: spendingMap[month],
  }));
};

export const processCategoryData = (receipts: Receipt[]): CategorySpending[] => {
  const categoryMap: Record<string, number> = {};

  receipts.forEach((receipt) => {
    const category = receipt.category || "Lainnya";
    categoryMap[category] = (categoryMap[category] || 0) + receipt.amount;
  });

  return Object.keys(categoryMap).map((name) => ({
    name,
    value: categoryMap[name],
  })).sort((a, b) => b.value - a.value);
};

export const calculateOverview = (receipts: Receipt[]) => {
  const total = receipts.reduce((sum, r) => sum + r.amount, 0);
  const average = receipts.length > 0 ? total / receipts.length : 0;
  
  // Highest spending month
  const monthly = processSpendingData(receipts);
  const highest = monthly.length > 0 ? Math.max(...monthly.map(m => m.amount)) : 0;

  return { total, average, highest };
};
