import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addAuthorizedOrigin } from '../../redux/actions/actionCreators';
import { UserStateObj } from '../../redux/reducers/userReducer';
import styled from 'styled-components';
import Input from '../../components/Input';
import Button from '../../components/Button';

const DashboardBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserStateObj }) => state.user);

  const [origin, setOrigin] = useState('');

  const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value);
  };

  const handleAddUrlClick = () => {
    // add authorized URL/origin to user document in database
    fetch('http://localhost:3000/api/user/addOrigin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: user._id,
        origin: origin,
      }),
    })
      .then((res) => res.json())
      .then((userDoc) => {
        // TODO: dispatch action to update user state branch
        console.log({ userDoc });
        dispatch(
          addAuthorizedOrigin({
            authorized_origins: userDoc.authorized_origins,
          })
        );
      });
  };

  return (
    <Bar>
      <NameContainer>
        <p>
          <strong>App origin(s): </strong>
          {user.authorized_origins ? (
            <DisplayOrigins>
              {user.authorized_origins.join(', ')}
            </DisplayOrigins>
          ) : (
            ''
          )}
        </p>
      </NameContainer>
      <UrlContainer>
        <Input
          name='URL'
          type='text'
          placeholder='https://example.app'
          value={origin}
          onChange={handleOriginChange}
        />
        <Button onClick={handleAddUrlClick}>Add authorized origin</Button>
      </UrlContainer>
    </Bar>
  );
};

const Bar = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameContainer = styled.div`
  max-width: 50%;

  & p {
    font-size: 1.2rem;
  }
`;

const DisplayOrigins = styled.span`
  font-size: 1rem;
`;

const UrlContainer = styled.div`
  & input,
  & button {
    width: max-content;
    font-size: 1rem;
    text-align: center;
    margin-left: 16px;
  }
`;

export default DashboardBar;