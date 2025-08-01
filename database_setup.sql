-- Family Travel Tracker Database Setup for NeonDB
-- This file contains all the necessary tables and data for the Family Travel Tracker application

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS visited_countries, users, countries CASCADE;

-- Create users table
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(15) UNIQUE NOT NULL,
    color VARCHAR(15)
);

-- Create countries table (contains all world countries with their codes)
CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL
);

-- Create visited_countries table (tracks which countries each user has visited)
CREATE TABLE visited_countries(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

-- Insert initial users (including your name)
INSERT INTO users (name, color) VALUES
    ('Angela', 'teal'),
    ('Jack', 'powderblue'),
    ('User', 'coral');

-- Insert sample countries (you'll need to add more countries as needed)
INSERT INTO countries (country_code, country_name) VALUES 
    ('US', 'United States'),
    ('CA', 'Canada'),
    ('MX', 'Mexico'),
    ('GB', 'United Kingdom'),
    ('FR', 'France'),
    ('DE', 'Germany'),
    ('IT', 'Italy'),
    ('ES', 'Spain'),
    ('JP', 'Japan'),
    ('CN', 'China'),
    ('IN', 'India'),
    ('AU', 'Australia'),
    ('BR', 'Brazil'),
    ('AR', 'Argentina'),
    ('RU', 'Russia'),
    ('ZA', 'South Africa'),
    ('EG', 'Egypt'),
    ('NG', 'Nigeria'),
    ('KE', 'Kenya'),
    ('TH', 'Thailand'),
    ('SG', 'Singapore'),
    ('MY', 'Malaysia'),
    ('ID', 'Indonesia'),
    ('PH', 'Philippines'),
    ('VN', 'Vietnam'),
    ('KR', 'South Korea'),
    ('TR', 'Turkey'),
    ('GR', 'Greece'),
    ('PT', 'Portugal'),
    ('NL', 'Netherlands'),
    ('BE', 'Belgium'),
    ('CH', 'Switzerland'),
    ('AT', 'Austria'),
    ('SE', 'Sweden'),
    ('NO', 'Norway'),
    ('DK', 'Denmark'),
    ('FI', 'Finland'),
    ('PL', 'Poland'),
    ('CZ', 'Czech Republic'),
    ('HU', 'Hungary'),
    ('RO', 'Romania'),
    ('BG', 'Bulgaria'),
    ('HR', 'Croatia'),
    ('SI', 'Slovenia'),
    ('SK', 'Slovakia'),
    ('LT', 'Lithuania'),
    ('LV', 'Latvia'),
    ('EE', 'Estonia'),
    ('IE', 'Ireland'),
    ('IS', 'Iceland'),
    ('MT', 'Malta'),
    ('CY', 'Cyprus'),
    ('LU', 'Luxembourg'),
    ('MC', 'Monaco'),
    ('AD', 'Andorra'),
    ('SM', 'San Marino'),
    ('VA', 'Vatican City'),
    ('LI', 'Liechtenstein'),
    ('UA', 'Ukraine'),
    ('BY', 'Belarus'),
    ('MD', 'Moldova'),
    ('RS', 'Serbia'),
    ('ME', 'Montenegro'),
    ('BA', 'Bosnia and Herzegovina'),
    ('MK', 'North Macedonia'),
    ('AL', 'Albania'),
    ('XK', 'Kosovo'),
    ('IL', 'Israel'),
    ('PS', 'Palestine'),
    ('JO', 'Jordan'),
    ('LB', 'Lebanon'),
    ('SY', 'Syria'),
    ('IQ', 'Iraq'),
    ('IR', 'Iran'),
    ('SA', 'Saudi Arabia'),
    ('AE', 'United Arab Emirates'),
    ('QA', 'Qatar'),
    ('KW', 'Kuwait'),
    ('BH', 'Bahrain'),
    ('OM', 'Oman'),
    ('YE', 'Yemen'),
    ('AF', 'Afghanistan'),
    ('PK', 'Pakistan'),
    ('BD', 'Bangladesh'),
    ('LK', 'Sri Lanka'),
    ('MV', 'Maldives'),
    ('BT', 'Bhutan'),
    ('NP', 'Nepal'),
    ('MM', 'Myanmar'),
    ('LA', 'Laos'),
    ('KH', 'Cambodia'),
    ('MN', 'Mongolia'),
    ('KZ', 'Kazakhstan'),
    ('UZ', 'Uzbekistan'),
    ('TM', 'Turkmenistan'),
    ('TJ', 'Tajikistan'),
    ('KG', 'Kyrgyzstan'),
    ('GE', 'Georgia'),
    ('AM', 'Armenia'),
    ('AZ', 'Azerbaijan'),
    ('CL', 'Chile'),
    ('PE', 'Peru'),
    ('EC', 'Ecuador'),
    ('CO', 'Colombia'),
    ('VE', 'Venezuela'),
    ('GY', 'Guyana'),
    ('SR', 'Suriname'),
    ('UY', 'Uruguay'),
    ('PY', 'Paraguay'),
    ('BO', 'Bolivia'),
    ('NZ', 'New Zealand'),
    ('FJ', 'Fiji'),
    ('PG', 'Papua New Guinea'),
    ('SB', 'Solomon Islands'),
    ('VU', 'Vanuatu'),
    ('NC', 'New Caledonia'),
    ('PF', 'French Polynesia'),
    ('WS', 'Samoa'),
    ('TO', 'Tonga'),
    ('KI', 'Kiribati'),
    ('TV', 'Tuvalu'),
    ('NR', 'Nauru'),
    ('PW', 'Palau'),
    ('FM', 'Micronesia'),
    ('MH', 'Marshall Islands');

-- Insert sample visited countries data
INSERT INTO visited_countries (country_code, user_id) VALUES 
    ('FR', 1), 
    ('GB', 1), 
    ('CA', 2), 
    ('FR', 2),
    ('US', 3),
    ('JP', 3);

-- Verify the setup
SELECT 'Users created:' as info;
SELECT * FROM users;

SELECT 'Sample visited countries:' as info;
SELECT u.name, c.country_name, vc.country_code 
FROM visited_countries vc
JOIN users u ON u.id = vc.user_id
JOIN countries c ON c.country_code = vc.country_code
ORDER BY u.name, c.country_name;
