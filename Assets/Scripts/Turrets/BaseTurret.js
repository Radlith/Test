#pragma strict

public class BaseTurret extends BaseHealth
{

	public var angle : float;
	public var minAngle : float = 0;
	public var maxAngle : float = 360;
	public var baseAngle : float = 0;
	public var rotationSpeed : float;
	
	public var varianceAngle : float; //If weapon is inaccurate
	
	public var anchored : boolean; //If turret's angle is affected by its transform

	public var refireDelay : float = 1; //Time between shots
	public var refireDelayVariance : float = 0.5;
	public var refireCounter : float = 1;
	
	public var bDebug : boolean;

	function Start () {
		super.Start();
	}
	
	function Update () {
		super.Update();
		
		if(refireCounter > 0)
		{
			refireCounter -= Time.deltaTime;
		}
		else
		{
			Fire();
			refireCounter += refireDelay + Random.Range(0,refireDelayVariance);
		}
			
	}

	//I'll probably want something built in to here to handle powering up the turrets.
	function Fire()
	{
		Debug.Log("BaseTurret.Fire");
	}

}

