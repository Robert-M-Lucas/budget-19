import {ReactNode} from "react";

const tips = [
    ["Meal Prep Sunday", "Cook meals in bulk on Sundays to save both time and money during the week."],
    ["Wants vs. Needs", "Before buying anything, ask yourself if it's a want or a need. Skip the wants if you're tight on budget."],
    ["Library Over Bookstore", "Utilize your local library instead of buying books to stretch your entertainment dollars further."],
    ["Subscription Review", "Take time today to review all your subscriptions. Cancel any that you haven't used in the last month."],
    ["Plan Your Grocery List", "Make a grocery list before shopping to avoid impulse buys. Stick to the list!"],
    ["Weekly Budget Review", "Take a few minutes to review your budget and spending habits from the past week. Adjust as needed."],
    ["Set a Savings Goal", "Set a specific, achievable savings goal for something you really want or need. "],
    ["Avoid ATM Fees", "Use your bank's ATM and avoid fees from other machines. "],
    ["Refinance Debts", "Look into refinancing options for any loans or credit cards to reduce interest rates and save money. "],
    ["Water Over Soda", "Drink water instead of soda when eating out. It's healthier and saves a bit on the bill. "],
    ["Invest in Quality", "Sometimes, spending more upfront for quality means you save money in the long run. "],
    ["Public Transport Passes", "If you frequently use public transport, consider buying a pass to save on individual tickets. "],
    ["Utility Usage Off-Peak", "Use appliances like washers and dishwashers during off-peak energy hours to save on utilities."],
    ["Automate Savings", "Set up an automatic transfer to your savings account every payday to ensure you consistently save without having to think about it."],
    ["Debt Snowball Method", "Start paying off debts from smallest to largest. This method gives you quick wins and motivates you to tackle larger debts."],
    ["Emergency Fund Focus", "Prioritize building an emergency fund that covers 3-6 months of living expenses. It's crucial for financial security."],
    ["Review Insurance Plans", "Annually review your health, auto, and home insurance to ensure you're getting the best rates and adequate coverage."],
    ["Analyze Bank Fees", "Review your banking fees and consider switching to a bank that offers better terms or no fees."],
    ["Long-term Goals", "Set long-term financial goals, such as buying a home or starting a business, and create a plan to achieve them."],
    ["Invest Wisely", "Educate yourself on investment options and consider diversifying your investments to minimize risks."],
    ["Negotiate Bills", "Regularly call service providers to negotiate better rates on your cable, internet, and phone bills."],
    ["Lifestyle Inflation", "Avoid increasing your spending as your income grows. Instead, direct any extra money towards savings or debt repayment."],
    ["Health Savings Account", "If eligible, use a Health Savings Account (HSA) to save money tax-free for medical expenses."],
    ["Understand Your Paycheck", "Fully understand the deductions and contributions on your paycheck to manage your income effectively."],
    ["Monitor Mental Your Health", "Financial stress can affect your mental health. Recognize when you might need to seek help to manage stress effectively."],
];

export default function tipOfTheDayTile(): ReactNode {
    const days = Math.floor(Date.now()/8.64e7);
    const tip = tips[days % tips.length];

    return <>
        <div className={"card-header text-center w-100 fw-bold p-1"}>
            Tip of the Day - {tip[0]}
        </div>
        <div className={"card-body d-flex align-items-center w-100 p-3"}>
            <span className={"text-center"}>
                {tip[1]}
            </span>
        </div>
    </>;
}