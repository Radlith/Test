#pragma strict

public class BaseMob extends BaseHealth
{
	public var HPMultiplier : float = 15;
	public var ShieldHPMultiplier : float = 0;
	public var ScoreMultiplier : float = 1;
	public var AccelerationMultiplier : float = 1;
	
	public var Level : int = 1;

	public var TimeBetweenActions : float = 2;
	public var TimeRemaining : float;
	
	public var currentAcceleration : Vector3;
	public var accelerationAmount : float = 1;
	
	public var ScoreValue : float = 1;
	
	public var fDebug : boolean = false;
	
	
	function Start () {
	
		if(!this.rigidbody) 
		{
			if (fDebug) Debug.Log("No rigidbody found! Self destructing");
			Destroy(this);
		}
		else
		{
			rigidbody.constraints = RigidbodyConstraints.FreezePositionY | rigidbody.constraints;
			rigidbody.useGravity = false;

		}
		super.Start();
		if (fDebug) Debug.Log("BaseMob Start!");
	}
	
	
	function Update () {
		super.Update();
		if(!MobSpawner.LevelBounds.Contains(this.transform.position))
		{
			if(rigidbody.isKinematic)
			{
				currentAcceleration = new Vector3();
			}
			else
			{
				rigidbody.velocity = new Vector3();
			}
			
			//var dist : float = MobSpawner.LevelBounds.SqrDistance(this.transform.position);
			//var movetarget : Vector3 = this.transform.position;
			//Fuck this noise, just snap it in place.
			var movetarget : Vector3 = this.transform.position;
			//if(movetarget.x < MobSpawner.LevelBounds.min.x) movetarget.x = MobSpawner.LevelBounds.min.x;
			//Lets try a thing!
			
			movetarget = Vector3.Min(movetarget, MobSpawner.LevelBounds.max);
			movetarget = Vector3.Max(movetarget, MobSpawner.LevelBounds.min);
			movetarget.y = 0;
			//Doesn't exactly feel right.  Sort of stops cold as soon as it touches a wall.  Meh.  Might need some tweaking.
			rigidbody.MovePosition(movetarget);
		}
	}
	
	function FixedUpdate()
	{
		if(TimeRemaining <= 0)
		{
			TimeRemaining = TimeBetweenActions;
			AIUpdate();
		}
		else
		{
			Accelerate();
			TimeRemaining -= Time.fixedDeltaTime;
		}
	}
	
	function Accelerate()
	{
		//currentAcceleration used to be 
		//rigidbody.AddForce(new Vector3(currentAcceleration.x, 0, currentAcceleration.y));
		rigidbody.AddForce(currentAcceleration);
	}
	
	function AIUpdate()
	{
		Debug.Log("Base AIUpdate called");
	}
	
	function OnDestroyed()
	{
		
	}
	
	function OnDestroy()
	{
		MobSpawner.MobCount -= 1;
		MobSpawner.instance.PointsEarned += ScoreValue;
	}
	
	function LevelUp()
	{
		Level += 1;		
		
		var iMult : int = Mathf.Pow(2, Level - 1);
		
		MaxHP = HPMultiplier * iMult;
		MaxShieldHP = ShieldHPMultiplier * iMult;
		ScoreValue = ScoreMultiplier * Level;
		accelerationAmount = AccelerationMultiplier * iMult;
	}
	
	function ResetLevel()
	{
		Level = 1;
		MaxHP = HPMultiplier;
		MaxShieldHP = ShieldHPMultiplier;
		ScoreValue = ScoreMultiplier ;
		accelerationAmount = AccelerationMultiplier;
	}
}

