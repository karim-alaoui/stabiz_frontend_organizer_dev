import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FormEvent } from 'react';

const CreateFounderProfile = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    area: '',
    prefecture: '',
    is_company: '',
    number_of_employees: '',
    capital: '',
    last_year_sales: '',
    established_date: '',
    business_partner_company: '',
    major_bank: '',
    company_features: '',
    job_description: '',
    application_conditions: '',
    employee_benefits: '',
    offered_income_range: '',
    work_start_date: '',
    company_industries: [],
    affiliated_companies: '',
    major_stock_holders: '',
    preferred_industries: [],
    preferred_prefectures: [],
    preferred_positions: [],
  });

  const [areaOptions, setAreaOptions] = useState([]);
  const [prefectureOptions, setPrefectureOptions] = useState([]);
  const [incomeOptions, setIncomeOptions] = useState([]);
  const [companyIndustryOptions, setCompanyIndustryOptions] = useState([]);
  const [preferredIndustryOptions, setPreferredIndustryOptions] = useState([]);
  const [preferredPrefectureOptions, setPreferredPrefectureOptions] = useState([]);
  const [preferredPositionOptions, setPreferredPositionOptions] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('organizer-token');

    if (!token) {
        router.push('/login'); // Redirect to login page if token is not found
        return;
    }

    fetch('http://localhost:8000/api/v1/area')
      .then((response) => response.json())
      .then((data) => setAreaOptions(data.data))
      .catch((error) => console.log(error));

    fetch('http://localhost:8000/api/v1/prefecture')
      .then((response) => response.json())
      .then((data) => setPrefectureOptions(data.data))
      .catch((error) => console.log(error));

    fetch('http://localhost:8000/api/v1/income')
      .then((response) => response.json())
      .then((data) =>  setIncomeOptions(data.data))
      .catch((error) => console.error(error));

    fetch('http://localhost:8000/api/v1/industry')
      .then((response) => response.json())
      .then((data) => setCompanyIndustryOptions(data.data))
      .catch((error) => console.log(error));

    fetch('http://localhost:8000/api/v1/industry')
      .then((response) => response.json())
      .then((data) => setPreferredIndustryOptions(data.data))
      .catch((error) => console.log(error));

    fetch('http://localhost:8000/api/v1/prefecture')
      .then((response) => response.json())
      .then((data) => setPreferredPrefectureOptions(data.data))
      .catch((error) => console.log(error));

    fetch('http://localhost:8000/api/v1/position')
      .then((response) => response.json())
      .then((data) => setPreferredPositionOptions(data.data))
      .catch((error) => console.log(error));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = event.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    if (selectedValues.length > 3) {
        // Limit the number of selections to 3
        return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: selectedValues,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Convert affiliated_companies and major_stock_holders to arrays
    const affiliatedCompaniesArray = formData.affiliated_companies.split(',').map((item) => item.trim());
    const majorStockHoldersArray = formData.major_stock_holders.split(',').map((item) => item.trim());

    // Create the JSON object
    const jsonData = {
        company_name: formData.company_name,
        area_id: formData.area,
        prefecture_id: formData.prefecture,
        is_listed_company: formData.is_company === 'true',
        no_of_employees: formData.number_of_employees,
        capital: formData.capital,
        last_year_sales: formData.last_year_sales,
        established_on: formData.established_date,
        business_partner_company: formData.business_partner_company,
        major_bank: formData.major_bank,
        company_features: formData.company_features,
        job_description: formData.job_description,
        application_conditions: formData.application_conditions,
        employee_benefits: formData.employee_benefits,
        offered_income_range_id: formData.offered_income_range,
        work_start_date_4_entr: formData.work_start_date,
        company_industry_ids: formData.company_industries,
        affiliated_companies: affiliatedCompaniesArray,
        major_stock_holders: majorStockHoldersArray,
        pfd_industry_ids: formData.preferred_industries,
        pfd_prefecture_ids: formData.preferred_prefectures,
        pfd_position_ids: formData.preferred_positions
    };

    try {
        // Log the JSON data
        console.log(jsonData);
        
        // Retrieve the organizer token from local storage
        const organizerToken = localStorage.getItem('organizer-token');
        console.log(organizerToken);
        // Send the JSON data to the API endpoint
        const response = await axios.post(
          'http://localhost:8000/api/v1/organizer/founder-profiles',
          jsonData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ organizerToken,
            },
          }
        );
    
        // Check if the response is successful
        if (response.status === 201) {
          // Redirect the user to the homepage with a success message
          router.push('/?message=Founder profile created successfully');
        }
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
        // Display an error message to the user or perform any other error handling logic
      }
  };

  return (
    <div>
      <h1>Create Founder Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Area:
          <select name="area" value={formData.area} onChange={handleInputChange} required>
            <option value="">Select</option>
            {areaOptions.map((area: any) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Prefecture:
          <select name="prefecture" value={formData.prefecture} onChange={handleInputChange} required>
            <option value="">Select</option>
            {prefectureOptions.map((prefecture: any) => (
              <option key={prefecture.id} value={prefecture.id}>
                {prefecture.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Is Company:
          <select name="is_company" value={formData.is_company} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <br />
        <label>
          Number of Employees:
          <input
            type="number"
            name="number_of_employees"
            value={formData.number_of_employees}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Capital:
          <input type="number" name="capital" value={formData.capital} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Last Year Sales:
          <input type="number" name="last_year_sales" value={formData.last_year_sales} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Established Date:
          <input
            type="date"
            name="established_date"
            value={formData.established_date}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Business Partner Company:
          <input
            type="text"
            name="business_partner_company"
            value={formData.business_partner_company}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Major Bank:
          <input
            type="text"
            name="major_bank"
            value={formData.major_bank}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Company Features:
          <textarea
            name="company_features"
            value={formData.company_features}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <br />
        <label>
          Job Description:
          <textarea
            name="job_description"
            value={formData.job_description}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <br />
        <label>
          Application Conditions:
          <textarea
            name="application_conditions"
            value={formData.application_conditions}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <br />
        <label>
          Employee Benefits:
          <textarea
            name="employee_benefits"
            value={formData.employee_benefits}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <br />
        <label>
            Offered Income Range:
            <select
                name="offered_income_range"
                value={formData.offered_income_range}
                onChange={handleInputChange}
                required
            >
                <option value="">Select</option>
                {incomeOptions.map((income: any) => (
                <option key={income.id} value={income.id}>
                    {income.lower_limit !== null && income.upper_limit !== null
                    ? `${income.lower_limit} - ${income.upper_limit} ${income.unit} ${income.currency}`
                    : income.upper_limit !== null
                    ? `Up to ${income.upper_limit} ${income.unit} ${income.currency}`
                    : income.lower_limit !== null
                    ? `From ${income.lower_limit} ${income.unit} ${income.currency}`
                    : ''}
                </option>
                ))}
            </select>
            </label>
        <br />
        <label>
          Work Start Date:
          <input
            type="date"
            name="work_start_date"
            value={formData.work_start_date}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Company Industries (up to 3 choices):
          <select
            name="company_industries"
            multiple
            value={formData.company_industries}
            onChange={handleMultiSelectChange}
            required
          >
            {companyIndustryOptions.map((industry: any) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Affiliated Companies:
          <input
            type="text"
            name="affiliated_companies"
            value={formData.affiliated_companies}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Major Stock Holders:
          <input
            type="text"
            name="major_stock_holders"
            value={formData.major_stock_holders}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Preferred Industries (up to 3 choices):
          <select
            name="preferred_industries"
            multiple
            value={formData.preferred_industries}
            onChange={handleMultiSelectChange}
            required
          >
            {preferredIndustryOptions.map((industry: any) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Preferred Prefectures (up to 3 choices):
          <select
            name="preferred_prefectures"
            multiple
            value={formData.preferred_prefectures}
            onChange={handleMultiSelectChange}
            required
          >
            {preferredPrefectureOptions.map((prefecture: any) => (
              <option key={prefecture.id} value={prefecture.id}>
                {prefecture.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Preferred Positions (up to 3 choices):
          <select
            name="preferred_positions"
            multiple
            value={formData.preferred_positions}
            onChange={handleMultiSelectChange}
            required
          >
            {preferredPositionOptions.map((position: any) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateFounderProfile;
