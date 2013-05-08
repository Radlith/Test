#pragma strict

public class PassiveMob extends BaseMob
{

	//This type of mob just sort of wanders idly.  It will occasionally pick a direction and accelerate in that direction until it changes its mind.
	public var ImpactDamageMultiplier : float = 1;
	public var ImpactDamage : float = 1;
	
	function Start () {
		super.Start();
		AIUpdate();
		TimeRemaining = Random.value * TimeBetweenActions;
		ImpactDamage = ImpactDamageMultiplier * Level;
	
	}
	
	function Update () {
		super.Update();
	}
	
	function FixedUpdate()
	{
		super.FixedUpdate();
	}
		
	function OnCollisionEnter(collision : Collision) {
		
		var collisionHealth : BaseHealth;
		
		//Only can damage the player, don't take damage unless actually hitting the player
		
		if((collision.gameObject.layer) == LayerMask.NameToLayer("PlayerShip"))
		{
			collisionHealth = collision.gameObject.GetComponent(BaseHealth);
			if(collisionHealth)
			{
				collisionHealth.ReceiveDamage(ImpactDamage);
				if(GetComponent(BaseHealth))
				{
					GetComponent(BaseHealth).ReceiveDamage(ImpactDamage);
				}
			}
		}
	}
	
	function OnCollisionStay(collision : Collision)
	{
		var collisionHealth : BaseHealth;
		
		if((collision.gameObject.layer) == LayerMask.NameToLayer("PlayerShip"))
		{
			collisionHealth = collision.gameObject.GetComponent(BaseHealth);
			if(collisionHealth)
			{
				collisionHealth.ReceiveDamage(ImpactDamage * Time.deltaTime);
				if(GetComponent(BaseHealth))
				{
					GetComponent(BaseHealth).ReceiveDamage(ImpactDamage * Time.deltaTime);
				}
			}
		}
	}
	
	//override function AIUpdate()
	function AIUpdate()
	{
		currentAcceleration = Random.insideUnitCircle * accelerationAmount * Random.value;
		currentAcceleration.z = currentAcceleration.y;
		currentAcceleration.y = 0;
	}

}