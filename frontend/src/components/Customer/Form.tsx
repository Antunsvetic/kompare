import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_CUSTOMER, GET_CITIES } from '../../graphql/graphqlQueries';
import { Loader } from 'semantic-ui-react';
import { User } from '../../context/user';

import './Form.css';

type SetUser = (user: User) => void;

const CustomerForm = ({ setUser } : { setUser: SetUser}) => {
    const { register, handleSubmit } = useForm()
    const { data: cities, loading } = useQuery(GET_CITIES)
    const [createCustomer, { loading: submitLoading }] = useMutation(CREATE_CUSTOMER)

    if(loading || submitLoading) return <Loader />

    const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
        const customer = await createCustomer({
            variables: { customerInput: formData }
        })
        if (customer?.data?.createCustomer) {
            setUser(customer.data.createCustomer)
            localStorage.setItem('user', JSON.stringify(customer.data.createCustomer));
        }
    }

    return (
        <form className='create-customer-form' onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Name:</label>
                <input {...register('name')} placeholder='Full name' required />
            </div>

            <div className="form-group">
                <label>Age:</label>
                <input {...register('age', { valueAsNumber: true })} placeholder='Enter your age' required />
            </div>

            <div className="form-group">
                <label>City:</label>
                <select {...register('city')} required>
                    {cities?.getCities?.map(({ name }: {name: string}) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Vehicle power:</label>
                <input {...register('vehiclePower', { valueAsNumber: true })} placeholder='Vehicle power' required />
            </div>

            <div className="form-group">
                <label>Voucher:</label>
                <input {...register('voucher', { valueAsNumber: true })} step="any" placeholder='voucher'/>
            </div>

            <button type='submit'>Submit </button>
        </form>
    )
}

export default CustomerForm;