CREATE TABLE financial_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    overall_score INT,
    savings_ratio_score INT,
    debt_ratio_score INT,
    emergency_fund_score INT,
    investment_score INT,
    insurance_score INT,
    ai_commentary TEXT,
    calculated_at TIMESTAMPTZ DEFAULT now()
);
