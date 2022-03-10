import { FC, ReactChildren, ReactChild, useEffect, useState } from 'react';
import { Badge, Card } from 'react-bootstrap';
import ZombieCanvas from './ZombieCanvas';
import { IZombie } from '../../interfaces';

interface IZombieHungerBadgeProps {
  hungerLevel: number;
  className?: string
}

interface IZombieCardProps {
  zombie: IZombie;
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

const ZombieHungerBadge: FC<IZombieHungerBadgeProps> = (props: IZombieHungerBadgeProps) => {

  const [bg, setBg] = useState<string>('success');
  const [status, setStatus] = useState<string>('Full');

  useEffect(() => {
    if (props.hungerLevel >= 90) {
      setBg('danger');
      setStatus('Famished');
    }
    else if (props.hungerLevel >= 70 && props.hungerLevel < 90) {
      setBg('warning');
      setStatus('Starving');
    }
    else if (props.hungerLevel >= 50 && props.hungerLevel < 70) {
      setBg('secondary');
      setStatus('Very Hungry');
    }
    else if (props.hungerLevel >= 30 && props.hungerLevel < 50) {
      setBg('info');
      setStatus('Hungry');
    }
    else {
      setBg('success');
      setStatus('Full');
    }
  }, [props.hungerLevel]);

  return (
    <Badge className={props.className} as={"p"} bg={bg}>{status}</Badge>
  );
};

const ZombieCard: FC<IZombieCardProps> = ({ zombie, children }: IZombieCardProps) => {
  return (
    <Card className="h-100 justify-content-center">
      <ZombieCanvas dna={zombie.dna} />
      <Card.Body>
        <Card.Title>
          {zombie.name}
          <small className="text-muted ms-1">#{zombie.id}</small>
        </Card.Title>
        <Card.Subtitle className="my-1 text-muted">Level: {zombie.level}</Card.Subtitle>
        <Card.Subtitle className="my-1 text-muted">
          Wins: {zombie.winCount} / Losses: {zombie.lossCount}
        </Card.Subtitle>
        {zombie.isReady && <Badge as={"p"} bg="success">Ready</Badge>}
        {!zombie.isReady && <Badge as={"p"} bg="warning">Tired</Badge>}
        <ZombieHungerBadge className="ms-1" hungerLevel={zombie.hungerLevel} />

        {children &&
          <Card.Footer className="px-0 pb-0 card-footer bg-transparent">
            {children}
          </Card.Footer>
        }
      </Card.Body>
    </Card>
  );
};

export default ZombieCard;
