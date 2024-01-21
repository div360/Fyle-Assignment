import pandas as pd

# Load your CSV file
df = pd.read_csv('data3.csv')

# Replace empty strings with NaN
df = df.replace('', pd.np.nan)

# Drop the rows where at least one element is missing
df = df.dropna()

# Save the result to a new CSV file
df.to_csv('cleaned_file.csv', index=False)